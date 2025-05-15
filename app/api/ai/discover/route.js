// app/api/ai/discover/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { openai } from "@/lib/openai";
import * as cheerio from "cheerio";

export async function POST(req) {
  try {
    const { input } = await req.json();
    if (!input) {
      return NextResponse.json({ error: "Missing input" }, { status: 400 });
    }

    // ————————————————————————————————————————————————
    // 0) Fetch and scrape the page if a URL was provided
    let scrapedText = "";
    if (input.startsWith("http")) {
      try {
        const pageRes = await fetch(input, {
          headers: { "User-Agent": "Mozilla/5.0" },
        });
        const html = await pageRes.text();
        const $ = cheerio.load(html);
        // Grab headings, paragraphs, list items
        scrapedText = $("h1,h2,h3,p,li")
          .map((_, el) => $(el).text().trim())
          .get()
          .join("\n");
      } catch (fetchErr) {
        console.warn("Could not fetch or parse HTML:", fetchErr.message);
      }
    }

    // ————————————————————————————————————————————————
    // 1) Prompt the LLM with schema + scraped text
    const systemPrompt = `You are a data extractor.  Given this scraped text plus a creator handle or URL, output *only* a JSON object matching this schema:

{
  "name": string,
  "username": string,
  "imageUrl": string|null,
  "bio": string,           // max 300 chars
  "socialLinks": [
    { "platform": string, "url": string }
  ],
  "items": [
    {
      "name": string,
      "description"?: string,
      "imageUrl"?: string,
      "url"?: string
    }
  ]
}

The "items" array should include every tool, piece of hardware, software, or gear the creator uses, including:
 • Tech stack (frameworks, languages, libraries)
 • Software tools (editors, communication/DevOps tools)
 • PC specs (CPU, GPU, motherboard, RAM, storage)
 • Peripherals (keyboard, mouse, monitors, headset)
 • Furniture & accessories (chair, desk, mic, camera)
 • Any other gear they publicly mention.

Here is the scraped text (if any):
\`\`\`
${scrapedText || "— no scraped text available —"}
\`\`\`

Creator handle or URL: "${input}"`;

    const model = process.env.OPENAI_MODEL || "gpt-3.5-turbo";
    const aiRes = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Extract the JSON now." },
      ],
      temperature: 0,
    });

    const raw = aiRes.choices[0].message.content;
    let profileData;
    try {
      profileData = JSON.parse(raw);
    } catch (parseErr) {
      console.error("AI JSON parse error:", raw, parseErr);
      return NextResponse.json(
        { error: "AI response was not valid JSON", raw },
        { status: 502 }
      );
    }

    // ————————————————————————————————————————————————
    // 2) Upsert the Profile by sourceUrl
    const slugify = (s = "") =>
      s
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    let username = slugify(profileData.username || profileData.name || "");
    if (!username) {
      username = `p-${Date.now()}`;
    } else {
      // ensure uniqueness
      const clash = await prisma.profile.findUnique({ where: { username } });
      if (clash) username = `${username}-${Date.now()}`;
    }

    let profile = await prisma.profile.findFirst({
      where: { sourceUrl: input },
    });

    if (profile) {
      profile = await prisma.profile.update({
        where: { id: profile.id },
        data: {
          name: profileData.name,
          username,
          image: profileData.imageUrl,
          bio: profileData.bio,
          socialLinks: profileData.socialLinks,
          updatedAt: new Date(),
        },
      });
    } else {
      profile = await prisma.profile.create({
        data: {
          name: profileData.name,
          username,
          image: profileData.imageUrl,
          bio: profileData.bio,
          socialLinks: profileData.socialLinks,
          sourceUrl: input,
        },
      });
    }

    // ————————————————————————————————————————————————
    // 3) Upsert an Inventory for this Profile
    const inv = await prisma.inventory.upsert({
      where: { profileId: profile.id },
      create: { profileId: profile.id },
      update: {},
    });

    // 4) Clear any old inventory items
    await prisma.itemOnInventory.deleteMany({
      where: { inventoryId: inv.id },
    });

    // 5) Upsert each extracted item and link to inventory
    for (const it of profileData.items || []) {
      // try by URL first
      let existing = it.url
        ? await prisma.item.findUnique({ where: { url: it.url } })
        : null;
      // fallback by name
      if (!existing) {
        existing = await prisma.item.findFirst({
          where: { name: it.name },
        });
      }

      const item = existing
        ? await prisma.item.update({
            where: { id: existing.id },
            data: {
              name: it.name,
              description: it.description,
              imageUrl: it.imageUrl,
              url: it.url,
            },
          })
        : await prisma.item.create({
            data: {
              name: it.name,
              description: it.description,
              imageUrl: it.imageUrl,
              url: it.url,
              sourceType: "AI_SCRAPE",
            },
          });

      await prisma.itemOnInventory.create({
        data: {
          itemId: item.id,
          inventoryId: inv.id,
        },
      });
    }

    // 6) Return the new profile handle
    return NextResponse.json({ username: profile.username });
  } catch (err) {
    console.error("Discover API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
