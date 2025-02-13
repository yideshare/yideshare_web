// app/page.tsx

"use client"; // Ensure this runs on the client-side

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <button
        onClick={() => (window.location.href = "/api/auth/cas-login")}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        Login with Yale CAS
      </button>
    </div>
  );
}
