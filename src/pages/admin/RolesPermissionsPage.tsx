import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Shield, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { RolesTable, RolePermissionMatrix, RoleDetailDrawer } from "@/components/roles";
import type { RoleRow } from "@/components/roles/RolesTable";
import type { PermissionRow } from "@/components/roles/RolePermissionMatrix";

const ROLE_DESCRIPTIONS: Record<string, string> = {
  admin: "Full system access with ability to manage all modules, users, and settings.",
  teacher: "Access to academic modules including attendance, homework, exams, and class management.",
  student: "View-only access to personal academic records, attendance, homework, and fees.",
  parent: "View-only access to their child's academic records, attendance, and fee status.",
};

interface UserInfo { id: string; fullName: string; email: string; }

export default function RolesPermissionsPage() {
  const { toast } = useToast();
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [selectedRole, setSelectedRole] = useState("admin");
  const [permissions, setPermissions] = useState<PermissionRow[]>([]);
  const [saving, setSaving] = useState(false);
  const [drawerRole, setDrawerRole] = useState<string | null>(null);
  const [drawerUsers, setDrawerUsers] = useState<UserInfo[]>([]);

  // Fetch role counts
  useEffect(() => {
    (async () => {
      const { data: profiles } = await supabase.from("profiles").select("role");
      const counts: Record<string, number> = {};
      (profiles || []).forEach((p: any) => { counts[p.role] = (counts[p.role] || 0) + 1; });

      const { data: permData } = await supabase.from("role_permissions").select("role, updated_at");
      const lastUpdated: Record<string, string> = {};
      (permData || []).forEach((p: any) => {
        if (!lastUpdated[p.role] || p.updated_at > lastUpdated[p.role]) lastUpdated[p.role] = p.updated_at;
      });

      setRoles(["admin", "teacher", "student", "parent"].map((r) => ({
        name: r,
        description: ROLE_DESCRIPTIONS[r] || "",
        userCount: counts[r] || 0,
        updatedAt: lastUpdated[r] || new Date().toISOString(),
      })));
    })();
  }, []);

  // Fetch permissions for selected role
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("role_permissions")
        .select("*")
        .eq("role", selectedRole)
        .order("module");

      setPermissions(
        (data || []).map((p: any) => ({
          module: p.module,
          canView: p.can_view || false,
          canCreate: p.can_create || false,
          canEdit: p.can_edit || false,
          canDelete: p.can_delete || false,
        }))
      );
    })();
  }, [selectedRole]);

  const handleToggle = useCallback(
    async (module: string, perm: "canView" | "canCreate" | "canEdit" | "canDelete", value: boolean) => {
      // Optimistic update
      setPermissions((prev) =>
        prev.map((p) => (p.module === module ? { ...p, [perm]: value } : p))
      );

      const colMap: Record<string, string> = { canView: "can_view", canCreate: "can_create", canEdit: "can_edit", canDelete: "can_delete" };
      setSaving(true);
      const { error } = await supabase
        .from("role_permissions")
        .update({ [colMap[perm]]: value, updated_at: new Date().toISOString() })
        .eq("role", selectedRole)
        .eq("module", module);

      if (error) {
        toast({ title: "Failed to update", description: error.message, variant: "destructive" });
        // Revert
        setPermissions((prev) =>
          prev.map((p) => (p.module === module ? { ...p, [perm]: !value } : p))
        );
      }
      setSaving(false);
    },
    [selectedRole, toast]
  );

  const openDrawer = useCallback(async (role: string) => {
    setDrawerRole(role);
    const { data } = await supabase.from("profiles").select("id, full_name, email").eq("role", role as any).limit(50);
    setDrawerUsers((data || []).map((u: any) => ({ id: u.id, fullName: u.full_name, email: u.email })));
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-6 max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <span>Dashboard</span><span>/</span><span>Settings</span><span>/</span><span className="text-foreground font-medium">Roles</span>
          </div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" /> Roles & Permissions
          </h1>
        </div>
        <Button variant="outline" size="sm" className="rounded-xl gap-2">
          <Info className="h-4 w-4" /> Help
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roles List */}
        <Card className="rounded-2xl lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">System Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <RolesTable
              roles={roles}
              selectedRole={selectedRole}
              onSelect={(r) => { setSelectedRole(r); openDrawer(r); }}
            />
          </CardContent>
        </Card>

        {/* Permission Matrix */}
        <Card className="rounded-2xl lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Permission Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            {permissions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Select a role to view permissions.</p>
            ) : (
              <RolePermissionMatrix
                role={selectedRole}
                permissions={permissions}
                onToggle={handleToggle}
                saving={saving}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <RoleDetailDrawer
        role={drawerRole}
        description={ROLE_DESCRIPTIONS[drawerRole || ""] || ""}
        users={drawerUsers}
        onClose={() => setDrawerRole(null)}
      />
    </motion.div>
  );
}
