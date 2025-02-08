// app/page.tsx

import Link from "next/link"

export default async function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Link
        href="/api/auth/cas-login"
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        Login with Yale CAS
      </Link>
    </div>
  )
}
