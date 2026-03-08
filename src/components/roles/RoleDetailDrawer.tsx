import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserInfo { id: string; fullName: string; email: string; }

interface Props {
  role: string | null;
  description: string;
  users: UserInfo[];
  onClose: () => void;
}

export const RoleDetailDrawer = memo(function RoleDetailDrawer({ role, description, users, onClose }: Props) {
  return (
    <AnimatePresence>
      {role && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background border-l border-border z-50 shadow-2xl overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold capitalize flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" /> {role}
                </h2>
                <Button variant="ghost" size="icon" className="rounded-xl" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="rounded-xl bg-muted/30 border border-border p-4">
                <p className="text-xs text-muted-foreground mb-1">Description</p>
                <p className="text-sm">{description}</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" /> Assigned Users
                  </h4>
                  <Badge variant="secondary" className="text-[10px]">{users.length}</Badge>
                </div>
                {users.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">No users with this role.</p>
                ) : (
                  <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-1">
                    {users.map((u, i) => (
                      <motion.div
                        key={u.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.02 }}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl bg-muted/30 hover:bg-accent/30 transition-colors"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">{u.fullName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{u.fullName}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{u.email}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});
