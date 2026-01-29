import { useState } from "react";
import { CreditCard, Download, CheckCircle, AlertCircle } from "lucide-react";
import { SimpleCard, StatsCard } from "@/components/dashboard/StatsCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function ParentFees() {
  const [fees] = useState<{ type: string; amount: number; dueDate: string; status: string }[]>([]);
  const totalDue = fees.filter(f => f.status === "pending").reduce((a, f) => a + f.amount, 0);
  const totalPaid = fees.filter(f => f.status === "paid").reduce((a, f) => a + f.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Fees & Payments</h1><p className="text-muted-foreground">View and pay fees online</p></div>
        <Button className="gradient-primary border-0" disabled={totalDue === 0}><CreditCard className="h-4 w-4 mr-2" />Pay Now</Button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Paid" value={`₹${totalPaid.toLocaleString()}`} icon={CheckCircle} variant="success" />
        <StatsCard title="Pending" value={`₹${totalDue.toLocaleString()}`} icon={AlertCircle} variant="warning" />
        <StatsCard title="Total Fees" value={`₹${(totalPaid + totalDue).toLocaleString()}`} icon={CreditCard} />
        <StatsCard title="Transactions" value={fees.length} icon={CreditCard} variant="primary" />
      </div>
      <SimpleCard title="Fee Details">
        {fees.length === 0 ? (
          <div className="text-center py-12"><CreditCard className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" /><p className="text-muted-foreground">No fee records available</p></div>
        ) : (
          <div className="space-y-3">{fees.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between p-4 rounded-lg border">
              <div><p className="font-medium">{f.type}</p><p className="text-sm text-muted-foreground">Due: {f.dueDate}</p></div>
              <div className="flex items-center gap-4"><span className="font-semibold">₹{f.amount.toLocaleString()}</span>
              <Badge className={f.status === "paid" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}>{f.status}</Badge>
              {f.status === "paid" && <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>}</div>
            </motion.div>
          ))}</div>
        )}
      </SimpleCard>
    </div>
  );
}
