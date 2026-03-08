import { StatsCard, SimpleCard } from "@/components/dashboard/StatsCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreditCard, Download } from "lucide-react";

const fees = [
  { type: "Tuition Fee", amount: 25000, paid: 25000, status: "paid", date: "Jan 5, 2024" },
  { type: "Transport Fee", amount: 8000, paid: 8000, status: "paid", date: "Jan 5, 2024" },
  { type: "Lab Fee", amount: 3000, paid: 3000, status: "paid", date: "Dec 10, 2023" },
  { type: "Exam Fee", amount: 2000, paid: 0, status: "pending", date: "—" },
];
const totalFee = fees.reduce((s, f) => s + f.amount, 0);
const totalPaid = fees.reduce((s, f) => s + f.paid, 0);

export default function StudentFees() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div><h1 className="text-3xl font-bold">Fees</h1><p className="text-muted-foreground">Your fee details and payment history</p></div>
        <Button variant="ghost"><Download className="h-4 w-4 mr-2" />Download Receipt</Button>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <StatsCard title="Total Fee" value={`₹${totalFee.toLocaleString()}`} icon={CreditCard} />
        <StatsCard title="Total Paid" value={`₹${totalPaid.toLocaleString()}`} icon={CreditCard} variant="success" />
        <StatsCard title="Balance Due" value={`₹${(totalFee - totalPaid).toLocaleString()}`} icon={CreditCard} variant="warning" />
      </div>
      <SimpleCard title="Fee Breakdown">
        <Table>
          <TableHeader><TableRow className="border-border/30"><TableHead>Fee Type</TableHead><TableHead className="text-right">Amount</TableHead><TableHead className="text-right">Paid</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
          <TableBody>{fees.map((f) => (
            <TableRow key={f.type} className="border-border/20 hover:bg-muted/30"><TableCell className="font-medium">{f.type}</TableCell><TableCell className="text-right">₹{f.amount.toLocaleString()}</TableCell><TableCell className="text-right">₹{f.paid.toLocaleString()}</TableCell><TableCell className="text-muted-foreground">{f.date}</TableCell><TableCell><Badge className={f.status === "paid" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}>{f.status}</Badge></TableCell></TableRow>
          ))}</TableBody>
        </Table>
      </SimpleCard>
    </div>
  );
}
