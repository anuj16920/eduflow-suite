import { memo, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpDown, Search, Receipt, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";

export interface PaymentRow {
  id: string;
  receiptNumber: string | null;
  paymentDate: string | null;
  amountPaid: number;
  paymentMethod: string | null;
  status: string | null;
  feeName: string;
}

const statusColors: Record<string, string> = {
  paid: "bg-emerald-500/10 text-emerald-500",
  pending: "bg-amber-500/10 text-amber-500",
  failed: "bg-destructive/10 text-destructive",
  refunded: "bg-primary/10 text-primary",
};

type SortKey = "paymentDate" | "amountPaid" | "receiptNumber";

const PAGE_SIZE = 8;

export const PaymentHistoryTable = memo(function PaymentHistoryTable({
  payments,
}: {
  payments: PaymentRow[];
}) {
  const [sortKey, setSortKey] = useState<SortKey>("paymentDate");
  const [sortAsc, setSortAsc] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRow | null>(null);

  const filtered = useMemo(() => {
    let list = payments;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          (p.receiptNumber || "").toLowerCase().includes(q) ||
          p.feeName.toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => {
      if (sortKey === "amountPaid") return sortAsc ? a.amountPaid - b.amountPaid : b.amountPaid - a.amountPaid;
      const av = (a[sortKey] || "") as string;
      const bv = (b[sortKey] || "") as string;
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }, [payments, search, sortKey, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  if (payments.length === 0) {
    return (
      <div className="text-center py-12">
        <Receipt className="h-12 w-12 mx-auto text-muted-foreground/20 mb-3" />
        <p className="text-muted-foreground">No payment history found</p>
      </div>
    );
  }

  return (
    <>
      {/* Search */}
      <div className="relative mb-4 max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          placeholder="Search receipt ID…"
          className="pl-9 rounded-xl bg-muted/40 border-0"
        />
      </div>

      <div className="overflow-x-auto rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              {[
                { key: "receiptNumber" as SortKey, label: "Receipt ID" },
                { key: "paymentDate" as SortKey, label: "Date" },
                { key: "amountPaid" as SortKey, label: "Amount" },
              ].map((col) => (
                <th
                  key={col.key}
                  className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => toggleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label} <ArrowUpDown className="h-3 w-3" />
                  </span>
                </th>
              ))}
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Method</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {paged.map((p, i) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b border-border/30 hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => setSelectedPayment(p)}
                >
                  <td className="px-4 py-3 font-medium">{p.receiptNumber || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {p.paymentDate ? format(new Date(p.paymentDate), "MMM d, yyyy") : "—"}
                  </td>
                  <td className="px-4 py-3 font-semibold">₹{p.amountPaid.toLocaleString()}</td>
                  <td className="px-4 py-3 text-muted-foreground capitalize">{p.paymentMethod || "—"}</td>
                  <td className="px-4 py-3">
                    <Badge className={statusColors[p.status || "paid"]}>{p.status || "paid"}</Badge>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-muted-foreground">
            Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>Prev</Button>
            <Button variant="ghost" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        </div>
      )}

      {/* Receipt Preview Modal */}
      <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" /> Payment Receipt
            </DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Receipt ID</p>
                  <p className="font-semibold">{selectedPayment.receiptNumber || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Date</p>
                  <p className="font-semibold">
                    {selectedPayment.paymentDate
                      ? format(new Date(selectedPayment.paymentDate), "MMM d, yyyy")
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Fee Type</p>
                  <p className="font-semibold">{selectedPayment.feeName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Method</p>
                  <p className="font-semibold capitalize">{selectedPayment.paymentMethod || "—"}</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-muted/40 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Amount Paid</p>
                <p className="text-3xl font-bold text-primary">₹{selectedPayment.amountPaid.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <Badge className={statusColors[selectedPayment.status || "paid"]}>
                  {selectedPayment.status || "paid"}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
});
