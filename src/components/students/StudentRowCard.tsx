import { memo } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface StudentRow {
  id: string;
  profile_id: string;
  full_name: string;
  email: string;
  avatar_url?: string | null;
  gender?: string | null;
  admission_number?: string | null;
  roll_number?: number | null;
  class_name?: string | null;
  section?: string | null;
  status?: string | null;
}

interface StudentRowCardProps {
  student: StudentRow;
  index: number;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (id: string) => void;
  showActions?: boolean;
}

const statusStyles: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  inactive: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  graduated: "bg-primary/10 text-primary border-primary/20",
};

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export const StudentRowCard = memo(function StudentRowCard({
  student, index, onView, onEdit, onDelete, onClick, showActions = true,
}: StudentRowCardProps) {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      whileHover={{ backgroundColor: "hsl(var(--muted) / 0.5)" }}
      className="border-b border-border/50 cursor-pointer transition-colors"
      onClick={() => onClick?.(student.id)}
    >
      {/* Photo + Name */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-border">
            <AvatarImage src={student.avatar_url || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {getInitials(student.full_name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-medium text-sm truncate">{student.full_name}</p>
            <p className="text-xs text-muted-foreground truncate">{student.email}</p>
          </div>
        </div>
      </td>

      {/* Student ID */}
      <td className="py-3 px-4 hidden md:table-cell">
        <span className="font-mono text-xs text-muted-foreground">
          {student.admission_number || "—"}
        </span>
      </td>

      {/* Class / Section */}
      <td className="py-3 px-4 hidden sm:table-cell">
        {student.class_name ? (
          <Badge variant="secondary" className="font-normal text-xs">
            {student.class_name}{student.section ? ` - ${student.section}` : ""}
          </Badge>
        ) : (
          <span className="text-xs text-muted-foreground">Unassigned</span>
        )}
      </td>

      {/* Roll No */}
      <td className="py-3 px-4 hidden lg:table-cell text-sm text-muted-foreground">
        {student.roll_number || "—"}
      </td>

      {/* Gender */}
      <td className="py-3 px-4 hidden lg:table-cell">
        <span className="text-sm capitalize text-muted-foreground">
          {student.gender || "—"}
        </span>
      </td>

      {/* Status */}
      <td className="py-3 px-4">
        <Badge
          variant="outline"
          className={cn("text-xs capitalize", statusStyles[student.status || "active"])}
        >
          {student.status || "active"}
        </Badge>
      </td>

      {/* Actions */}
      {showActions && (
        <td className="py-3 px-2" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView?.(student.id)}>
                <Eye className="h-4 w-4 mr-2" />View Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(student.id)}>
                <Edit className="h-4 w-4 mr-2" />Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={() => onDelete?.(student.id)}>
                <Trash2 className="h-4 w-4 mr-2" />Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      )}
    </motion.tr>
  );
});
