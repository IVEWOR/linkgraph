app/
 ├─ (public)
 │   ├─ page.jsx          // home
 │   └─ [username]/page.jsx
 ├─ (auth)
 │   ├─ login/page.jsx
 ├─ (dashboard)           //  ⟵ protected group
 │   ├─ layout.jsx
 │   ├─ page.jsx          // overview
 │   └─ inventory/page.jsx
 ├─ (admin)               //  ⟵ admin-only group
 │   ├─ profiles/page.jsx
 │   └─ items/page.jsx
 api/
 ├─ auth/[...nextauth]/route.js
 ├─ stripe/webhook/route.js
 └─ scrape/route.js       // AI ingestion