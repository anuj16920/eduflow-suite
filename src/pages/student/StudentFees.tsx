import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreditCard, Download } from "lucide-react";

const fees = [
  { id: 1, type: "Tuition Fee", amount: 25000, paid: 25000, status: "paid", date: "Jan 15, 2026" },
  { id: 2, type: "Lab Fee", amount: 5000, paid: 5000, status: "paid", date: "Jan 15, 2026" },
  { id: 3, type: "Transport Fee", amount: 8000, paid: 4000, status: "partial", date: "Feb 1, 2026" },
  { id: 4, type: "Library Fee", amount: 2000, paid: 0, status: "unpaid", date: "-" },
  { id: 5, type: "Sports Fee", amount: 3000, paid: 3000, status: "paid", date: "Jan 20, 2026" },
];

const totalFee = fees.reduce((s, f) => s + f.amount, 0);
const totalPaid = fees.reduce((s, f) => s + f.paid, 0);

export default function StudentFees() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fees</h1>
          <p className="text-muted-foreground">Fee payment history and dues</p>
        </div>
        <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Download Receipt</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="p-4 text-center"><p className="text-sm text-muted-foreground">Total Fee</p><p className="text-3xl font-bold">₹{totalFee.toLocaleString()}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-sm text-muted-foreground">Total Paid</p><p className="text-3xl font-bold text-success">₹{totalPaid.toLocaleString()}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-sm text-muted-foreground">Balance Due</p><p className="text-3xl font-bold text-destructive">₹{(totalFee - totalPaid).toLocaleString()}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5 text-primary" /> Fee Details</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fee Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Payment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fees.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="font-medium">{f.type}</TableCell>
                  <TableCell>₹{f.amount.toLocaleString()}</TableCell>
                  <TableCell>₹{f.paid.toLocaleString()}</TableCell>
                  <TableCell>₹{(f.amount - f.paid).toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={f.status === "paid" ? "default" : f.status === "partial" ? "secondary" : "destructive"}>
                      {f.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{f.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
