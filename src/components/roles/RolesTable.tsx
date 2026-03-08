import { memo, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Shield, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface RoleRow {
  name: string;
  description: string;
  userCount: number;
  updatedAt: string;
}

interface Props {
  roles: RoleRow[];
  selectedRole: string;
  onSelect: (role: string) => void;
}

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-primary/10 text-primary",
  teacher: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  student: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  parent: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
};

export const RolesTable = memo(function RolesTable({ roles, selectedRole, onSelect }: Props) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () => roles.filter((r) => r.name.toLowerCase().includes(search.toLowerCase())),
    [roles, search]
  );

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search roles..."
          className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-border bg-card outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
        />
      </div>

      <div className="space-y-1.5">
        {filtered.map((role, i) => (
          <motion.button
            key={role.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ x: 4 }}
            onClick={() => onSelect(role.name)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
              selectedRole === role.name
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border bg-card hover:bg-accent/50"
            }`}
          >
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${ROLE_COLORS[role.name] || "bg-muted"}`}>
              <Shield className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold capitalize">{role.name}</p>
              <p className="text-xs text-muted-foreground truncate">{role.description}</p>
            </div>
            <div className="text-right shrink-0">
              <Badge variant="secondary" className="text-[10px] gap-1">
                <Users className="h-3 w-3" /> {role.userCount}
              </Badge>
            </div>
          </motion.button>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">No roles found.</p>
        )}
      </div>
    </div>
  );
});
