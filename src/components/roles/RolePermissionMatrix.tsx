import { memo, useCallback } from "react";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

export interface PermissionRow {
  module: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

interface Props {
  role: string;
  permissions: PermissionRow[];
  onToggle: (module: string, perm: "canView" | "canCreate" | "canEdit" | "canDelete", value: boolean) => void;
  saving: boolean;
}

const PERM_KEYS: { key: "canView" | "canCreate" | "canEdit" | "canDelete"; label: string }[] = [
  { key: "canView", label: "View" },
  { key: "canCreate", label: "Create" },
  { key: "canEdit", label: "Edit" },
  { key: "canDelete", label: "Delete" },
];

export const RolePermissionMatrix = memo(function RolePermissionMatrix({ role, permissions, onToggle, saving }: Props) {
  const enabledCount = permissions.reduce(
    (acc, p) => acc + (p.canView ? 1 : 0) + (p.canCreate ? 1 : 0) + (p.canEdit ? 1 : 0) + (p.canDelete ? 1 : 0),
    0
  );
  const totalCount = permissions.length * 4;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold capitalize">{role} Permissions</h3>
          <p className="text-xs text-muted-foreground">{enabledCount}/{totalCount} permissions enabled</p>
        </div>
        {saving && <Badge variant="secondary" className="text-[10px] animate-pulse">Saving...</Badge>}
      </div>

      {/* Header */}
      <div className="hidden sm:grid grid-cols-[1fr_repeat(4,80px)] gap-2 text-xs font-medium text-muted-foreground px-3">
        <span>Module</span>
        {PERM_KEYS.map((p) => (
          <span key={p.key} className="text-center">{p.label}</span>
        ))}
      </div>

      {/* Rows */}
      <div className="space-y-1.5">
        {permissions.map((perm, i) => (
          <motion.div
            key={perm.module}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className="grid grid-cols-1 sm:grid-cols-[1fr_repeat(4,80px)] gap-2 items-center p-3 rounded-xl border border-border bg-card hover:bg-accent/30 transition-colors"
          >
            <span className="text-sm font-medium">{perm.module}</span>
            {PERM_KEYS.map((pk) => (
              <div key={pk.key} className="flex items-center justify-between sm:justify-center gap-2">
                <span className="text-xs text-muted-foreground sm:hidden">{pk.label}</span>
                <Switch
                  checked={perm[pk.key]}
                  onCheckedChange={(val) => onToggle(perm.module, pk.key, val)}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
});
