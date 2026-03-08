import { useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StudentRowCard, StudentRow } from "./StudentRowCard";
import { cn } from "@/lib/utils";

type SortField = "full_name" | "admission_number" | "class_name" | "roll_number" | "status";
type SortDir = "asc" | "desc";

interface StudentTableProps {
  students: StudentRow[];
  loading: boolean;
  sortField: SortField;
  sortDir: SortDir;
  onSort: (field: SortField) => void;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (id: string) => void;
  showActions?: boolean;
}

const columns: { key: SortField; label: string; hiddenClass?: string }[] = [
  { key: "full_name", label: "Student" },
  { key: "admission_number", label: "Student ID", hiddenClass: "hidden md:table-cell" },
  { key: "class_name", label: "Class / Section", hiddenClass: "hidden sm:table-cell" },
  { key: "roll_number", label: "Roll No", hiddenClass: "hidden lg:table-cell" },
  { key: "full_name", label: "Gender", hiddenClass: "hidden lg:table-cell" },
  { key: "status", label: "Status" },
];

function SortIcon({ field, sortField, sortDir }: { field: SortField; sortField: SortField; sortDir: SortDir }) {
  if (field !== sortField) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-40" />;
  return sortDir === "asc"
    ? <ArrowUp className="h-3 w-3 ml-1 text-primary" />
    : <ArrowDown className="h-3 w-3 ml-1 text-primary" />;
}

function TableSkeleton() {
  return (
    <tbody>
      {Array.from({ length: 8 }).map((_, i) => (
        <tr key={i} className="border-b border-border/50">
          <td className="py-3 px-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-3 w-36" />
              </div>
            </div>
          </td>
          <td className="py-3 px-4 hidden md:table-cell"><Skeleton className="h-3.5 w-24" /></td>
          <td className="py-3 px-4 hidden sm:table-cell"><Skeleton className="h-5 w-20 rounded-full" /></td>
          <td className="py-3 px-4 hidden lg:table-cell"><Skeleton className="h-3.5 w-8" /></td>
          <td className="py-3 px-4 hidden lg:table-cell"><Skeleton className="h-3.5 w-12" /></td>
          <td className="py-3 px-4"><Skeleton className="h-5 w-16 rounded-full" /></td>
          <td className="py-3 px-2"><Skeleton className="h-8 w-8 rounded-md" /></td>
        </tr>
      ))}
    </tbody>
  );
}

export const StudentTable = memo(function StudentTable({
  students, loading, sortField, sortDir, onSort, onView, onEdit, onDelete, onClick, showActions = true,
}: StudentTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border/50 bg-card/50">
      <table className="w-full text-sm">
        <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur-sm">
          <tr className="border-b border-border">
            {columns.map((col, i) => (
              <th
                key={`${col.key}-${i}`}
                className={cn(
                  "py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                  col.hiddenClass
                )}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 font-semibold text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
                  onClick={() => i !== 4 && onSort(col.key)}
                >
                  {col.label}
                  {i !== 4 && <SortIcon field={col.key} sortField={sortField} sortDir={sortDir} />}
                </Button>
              </th>
            ))}
            {showActions && <th className="py-3 px-2 w-10" />}
          </tr>
        </thead>

        {loading ? (
          <TableSkeleton />
        ) : students.length === 0 ? (
          <tbody>
            <tr>
              <td colSpan={showActions ? 7 : 6} className="py-16 text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-2"
                >
                  <GraduationCap className="h-12 w-12 text-muted-foreground/40" />
                  <p className="text-muted-foreground font-medium">No students found</p>
                  <p className="text-xs text-muted-foreground">Try adjusting your search or filters</p>
                </motion.div>
              </td>
            </tr>
          </tbody>
        ) : (
          <AnimatePresence mode="popLayout">
            <tbody>
              {students.map((s, i) => (
                <StudentRowCard
                  key={s.id}
                  student={s}
                  index={i}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onClick={onClick}
                  showActions={showActions}
                />
              ))}
            </tbody>
          </AnimatePresence>
        )}
      </table>
    </div>
  );
});
