import { memo } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Mail, Phone, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudentProfileHeaderProps {
  student: {
    full_name: string;
    email: string;
    phone?: string | null;
    avatar_url?: string | null;
    gender?: string | null;
    address?: string | null;
    admission_number?: string | null;
    class_name?: string | null;
    section?: string | null;
    status?: string | null;
    date_of_birth?: string | null;
  };
  canEdit?: boolean;
  onEdit?: () => void;
}

const statusStyles: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  inactive: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  graduated: "bg-primary/10 text-primary border-primary/20",
};

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export const StudentProfileHeader = memo(function StudentProfileHeader({
  student, canEdit, onEdit,
}: StudentProfileHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl bg-card border border-border/50 overflow-hidden"
    >
      {/* Banner */}
      <div className="h-28 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/10 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.15),transparent_60%)]" />
      </div>

      {/* Profile Info */}
      <div className="px-6 pb-6 -mt-12">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
            <AvatarImage src={student.avatar_url || undefined} />
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
              {getInitials(student.full_name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0 sm:pb-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight truncate">{student.full_name}</h1>
              <Badge
                variant="outline"
                className={cn("text-xs capitalize w-fit", statusStyles[student.status || "active"])}
              >
                {student.status || "active"}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
              {student.admission_number && (
                <span className="text-sm text-muted-foreground font-mono">{student.admission_number}</span>
              )}
              {student.class_name && (
                <Badge variant="secondary" className="text-xs font-normal">
                  {student.class_name}{student.section ? ` - ${student.section}` : ""}
                </Badge>
              )}
            </div>
          </div>

          {canEdit && (
            <Button variant="outline" size="sm" onClick={onEdit} className="shrink-0">
              <Edit className="h-4 w-4 mr-2" />Edit Profile
            </Button>
          )}
        </div>

        {/* Contact row */}
        <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Mail className="h-3.5 w-3.5" />{student.email}
          </div>
          {student.phone && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Phone className="h-3.5 w-3.5" />{student.phone}
            </div>
          )}
          {student.address && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />{student.address}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});
