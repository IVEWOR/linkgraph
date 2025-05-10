import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // 🔐 Access control
  if (!session || session.user.role !== "ADMIN") {
    return (
      <div className="max-w-xl mx-auto p-10 text-center">
        <h1 className="text-2xl font-semibold">Access Denied</h1>
        <p className="text-gray-600">You do not have admin privileges.</p>
        <Link href="/" className="text-blue-600 underline mt-4 inline-block">
          Go back to homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🛠️ Admin Dashboard</h1>
      <div className="flex gap-2">
        <Link
          className="inline-flex gap-2 border rounded-xl border-gray-400 text-gray-800 px-3 py-2"
          href="/admin/users"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
            />
          </svg>
          <span>Users</span>
        </Link>
        <Link
          className="inline-flex gap-2 border rounded-xl border-gray-400 text-gray-800 px-3 py-2"
          href="/admin/items"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3"
            />
          </svg>
          <span>Items</span>
        </Link>
      </div>
    </div>
  );
}
