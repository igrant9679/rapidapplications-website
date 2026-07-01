import { useState } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, Shield, Edit2, Eye, FileEdit } from "lucide-react";
import { toast } from "sonner";

const roleIcons = {
  admin: Shield,
  editor: FileEdit,
  author: Edit2,
  contributor: Edit2,
  subscriber: Users,
};

const roleColors = {
  admin: "destructive",
  editor: "default",
  author: "secondary",
  contributor: "secondary",
  subscriber: "outline",
} as const;

const roleDescriptions = {
  admin: "Full access to all features and settings",
  editor: "Can publish and manage all content; moderate comments",
  author: "Can publish and manage own content",
  contributor: "Can create and edit own content (drafts only)",
  subscriber: "Can read content and manage own profile",
};

export default function AdminUsers() {
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");

  const { data: users = [], refetch } = trpc.userManagement.listUsers.useQuery();
  const updateRoleMutation = trpc.userManagement.updateUserRole.useMutation({
    onSuccess: () => {
      toast.success("User role updated successfully");
      refetch();
      setEditingUserId(null);
      setSelectedRole("");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update user role");
    },
  });

  const handleUpdateRole = (userId: number) => {
    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }
    updateRoleMutation.mutate({
      userId,
      role: selectedRole as any,
    });
  };

  // Count users by role
  const roleCounts = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage user roles and permissions
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <Shield className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{roleCounts.admin || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Editors</CardTitle>
              <FileEdit className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{roleCounts.editor || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contributors</CardTitle>
              <Edit2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{roleCounts.contributor || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Authors</CardTitle>
              <Edit2 className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{roleCounts.author || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Role Descriptions */}
        <Card>
          <CardHeader>
            <CardTitle>Role Permissions</CardTitle>
            <CardDescription>
              Understanding what each role can do
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(roleDescriptions).map(([role, description]) => {
                const Icon = roleIcons[role as keyof typeof roleIcons];
                return (
                  <div key={role} className="flex items-start gap-3 p-3 border rounded-lg">
                    <Icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium capitalize">{role}</span>
                        <Badge variant={roleColors[role as keyof typeof roleColors]}>
                          {role}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>
              Manage user roles and access levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {users.map((user) => {
                const Icon = roleIcons[user.role as keyof typeof roleIcons];
                const isEditing = editingUserId === user.id;

                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{user.name || "Unknown User"}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {isEditing ? (
                        <>
                          <Select
                            value={selectedRole}
                            onValueChange={setSelectedRole}
                          >
                            <SelectTrigger className="w-[150px]">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="editor">Editor</SelectItem>
                              <SelectItem value="author">Author</SelectItem>
                              <SelectItem value="contributor">Contributor</SelectItem>
                              <SelectItem value="subscriber">Subscriber</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            size="sm"
                            onClick={() => handleUpdateRole(user.id)}
                            disabled={updateRoleMutation.isPending}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingUserId(null);
                              setSelectedRole("");
                            }}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Badge variant={roleColors[user.role as keyof typeof roleColors]}>
                            {user.role}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingUserId(user.id);
                              setSelectedRole(user.role);
                            }}
                          >
                            Change Role
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
