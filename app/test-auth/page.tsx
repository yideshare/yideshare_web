import { getUserNetIdFromCookies } from "@/lib/user";
import { cookies } from "next/headers";

export default async function TestAuth() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");
  
  let netId = null;
  let userData = null;
  
  try {
    netId = await getUserNetIdFromCookies();
    if (userCookie) {
      userData = JSON.parse(userCookie.value);
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Authentication Test</h1>
      
      <div className="space-y-4">
        <div>
          <strong>User Cookie Exists:</strong> {userCookie ? "Yes" : "No"}
        </div>
        
        <div>
          <strong>NetID:</strong> {netId || "Not found"}
        </div>
        
        <div>
          <strong>User Data:</strong>
          <pre className="bg-gray-100 p-2 mt-2 rounded">
            {JSON.stringify(userData, null, 2)}
          </pre>
        </div>
        
        <div>
          <strong>All Cookies:</strong>
          <pre className="bg-gray-100 p-2 mt-2 rounded">
            {JSON.stringify(Array.from(cookieStore.getAll()).map(c => ({ name: c.name, value: c.value })), null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
