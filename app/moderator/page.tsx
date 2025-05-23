import { requireRole } from "@/lib/auth-utils";
import { auth } from "@/auth";

export default async function ModeratorPage() {
  // This will redirect if the user is not a moderator or admin
  const session = await requireRole("moderator");
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Moderator Dashboard</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Welcome, Moderator!</h2>
        <p className="mb-4">
          This page is accessible to users with the moderator or admin role.
        </p>
        
        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-md">
          <h3 className="font-medium text-blue-800 dark:text-blue-200">Your Session Info</h3>
          <pre className="mt-2 text-sm overflow-auto p-2 bg-gray-100 dark:bg-gray-700 rounded">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Content Moderation</h2>
          <p>Review and moderate user-generated content.</p>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Review Content
          </button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">User Reports</h2>
          <p>Handle user reports and issues.</p>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            View Reports
          </button>
        </div>
      </div>
    </div>
  );
}
