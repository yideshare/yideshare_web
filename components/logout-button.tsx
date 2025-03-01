"use client" 

export function LogoutButton() {
    return (
        <button
            onClick={() => (window.location.href = "/api/auth/logout")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
        Logout
        </button>
    );
}