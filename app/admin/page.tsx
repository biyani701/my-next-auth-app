import { requireRole } from "@/lib/auth-utils";
import { auth } from "@/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import UserManagement from "@/components/admin/user-management";
import SessionCleanup from "@/components/admin/session-cleanup";

export default async function AdminPage() {
  // This will redirect if the user is not an admin
  const session = await requireRole("admin");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Welcome, Admin!</h2>
        <p className="mb-4">
          This page is only accessible to users with the admin role.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-md">
          <h3 className="font-medium text-blue-800 dark:text-blue-200">Your Session Info</h3>
          <pre className="mt-2 text-sm overflow-auto p-2 bg-gray-100 dark:bg-gray-700 rounded">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="sessions">Session Management</TabsTrigger>
          <TabsTrigger value="settings">Site Settings</TabsTrigger>
          <TabsTrigger value="logs">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <UserManagement />
        </TabsContent>

        <TabsContent value="sessions" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <SessionCleanup />
        </TabsContent>

        <TabsContent value="settings" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Site Settings</h2>
          <p className="mb-4">Configure global site settings and preferences.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Authentication Settings</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Configure session strategy, token lifetime, and other auth settings.
              </p>
              <a href="/admin/auth-settings">
                <Button
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Edit Auth Settings
                </Button>
              </a>
            </div>

            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Role Configuration</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Define custom roles and permissions for your application.
              </p>
              <a href="/admin/role-config">
                <Button
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Configure Roles
                </Button>
              </a>
            </div>

            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">API Tester</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Test API endpoints including the click tracking API.
              </p>
              <a href="/admin/api-tester">
                <Button
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Open API Tester
                </Button>
              </a>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Audit Logs</h2>
          <p className="mb-4">View authentication and authorization activity logs.</p>

          <div className="text-center py-8 text-muted-foreground">
            <p>Audit logging feature coming soon.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
