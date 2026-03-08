import { memo } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Phone, User, Briefcase } from "lucide-react";

interface ParentInfo {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  relationship?: string | null;
  occupation?: string | null;
}

interface ParentDetailsProps {
  parents: ParentInfo[];
}

export const ParentDetails = memo(function ParentDetails({ parents }: ParentDetailsProps) {
  if (parents.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 mx-auto text-muted-foreground/40 mb-2" />
        <p className="text-muted-foreground">No parent/guardian details linked</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {parents.map((p, i) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
          className="rounded-xl border border-border/50 bg-card/50 p-5 hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-11 w-11 border border-border">
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                {p.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{p.full_name}</p>
              {p.relationship && (
                <p className="text-xs text-muted-foreground capitalize">{p.relationship}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-3.5 w-3.5 shrink-0" />{p.email}
            </div>
            {p.phone && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-3.5 w-3.5 shrink-0" />{p.phone}
              </div>
            )}
            {p.occupation && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Briefcase className="h-3.5 w-3.5 shrink-0" />{p.occupation}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
});
