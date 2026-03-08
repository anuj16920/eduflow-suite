import { memo } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CreditCard, CheckCircle2, AlertCircle } from "lucide-react";

interface FeeRecord {
  id: string;
  name: string;
  amount: number;
  paid: number;
  status: string;
  due_date?: string | null;
}

interface FeeStatusCardProps {
  fees: FeeRecord[];
  totalPaid: number;
  totalPending: number;
}

export const FeeStatusCard = memo(function FeeStatusCard({ fees, totalPaid, totalPending }: FeeStatusCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl bg-emerald-500/10 p-4 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Paid</p>
          <p className="text-xl font-bold text-emerald-600">₹{totalPaid.toLocaleString()}</p>
        </div>
        <div className="rounded-xl bg-destructive/10 p-4 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Pending</p>
          <p className="text-xl font-bold text-destructive">₹{totalPending.toLocaleString()}</p>
        </div>
        <div className="rounded-xl bg-primary/10 p-4 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Fees</p>
          <p className="text-xl font-bold text-primary">₹{(totalPaid + totalPending).toLocaleString()}</p>
        </div>
      </div>

      {/* Fee list */}
      {fees.length === 0 ? (
        <div className="text-center py-12">
          <CreditCard className="h-12 w-12 mx-auto text-muted-foreground/40 mb-2" />
          <p className="text-muted-foreground">No fee records found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {fees.map((f, i) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
              className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card/50 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                {f.status === "paid" ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
                )}
                <div>
                  <p className="font-medium text-sm">{f.name}</p>
                  {f.due_date && <p className="text-xs text-muted-foreground">Due: {f.due_date}</p>}
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm">₹{f.amount.toLocaleString()}</p>
                <Badge
                  variant="outline"
                  className={cn("text-xs capitalize", f.status === "paid"
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    : "bg-destructive/10 text-destructive border-destructive/20"
                  )}
                >
                  {f.status}
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
});
