import { SimpleCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Download, CreditCard, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

const feeData = [
  {
    id: "STU001",
    student: "Aarav Sharma",
    class: "10-A",
    totalFee: 75000,
    paid: 75000,
    due: 0,
    status: "paid",
    lastPayment: "2024-01-05",
  },
  {
    id: "STU002",
    student: "Ananya Patel",
    class: "10-A",
    totalFee: 75000,
    paid: 75000,
    due: 0,
    status: "paid",
    lastPayment: "2024-01-03",
  },
  {
    id: "STU003",
    student: "Arjun Verma",
    class: "10-A",
    totalFee: 75000,
    paid: 50000,
    due: 25000,
    status: "partial",
    lastPayment: "2023-12-15",
  },
  {
    id: "STU004",
    student: "Diya Singh",
    class: "10-B",
    totalFee: 75000,
    paid: 75000,
    due: 0,
    status: "paid",
    lastPayment: "2024-01-02",
  },
  {
    id: "STU005",
    student: "Ishaan Kumar",
    class: "10-B",
    totalFee: 75000,
    paid: 0,
    due: 75000,
    status: "pending",
    lastPayment: null,
  },
];

export default function FeesManagement() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Fees & Accounts</h1>
          <p className="text-muted-foreground">Manage fee collection and financial records</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button className="gradient-primary border-0 text-primary-foreground hover:opacity-90">
            <CreditCard className="h-4 w-4 mr-2" />
            Collect Fee
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <div className="p-6 rounded-xl gradient-primary text-primary-foreground">
          <div className="flex items-center justify-between mb-2">
            <CreditCard className="h-5 w-5 opacity-80" />
            <TrendingUp className="h-4 w-4" />
          </div>
          <p className="text-sm opacity-80">Total Collected</p>
          <p className="text-3xl font-bold">₹24.5L</p>
        </div>
        <div className="p-6 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="h-5 w-5 text-warning" />
          </div>
          <p className="text-sm text-muted-foreground">Pending Dues</p>
          <p className="text-3xl font-bold">₹3.2L</p>
        </div>
        <div className="p-6 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="h-5 w-5 text-success" />
          </div>
          <p className="text-sm text-muted-foreground">Fully Paid</p>
          <p className="text-3xl font-bold">2,156</p>
        </div>
        <div className="p-6 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
          </div>
          <p className="text-sm text-muted-foreground">Defaulters</p>
          <p className="text-3xl font-bold">89</p>
        </div>
      </div>

      {/* Fee Table */}
      <SimpleCard title="Student Fee Status">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name or ID..." className="pl-9" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              All Classes
            </Button>
            <Button variant="outline" size="sm">
              Filter Status
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead className="text-right">Total Fee</TableHead>
                <TableHead className="text-right">Paid</TableHead>
                <TableHead className="text-right">Due</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Payment</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feeData.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">
                          {fee.student.split(" ").map((n) => n[0]).join("")}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{fee.student}</p>
                        <p className="text-xs text-muted-foreground">{fee.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{fee.class}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ₹{fee.totalFee.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-success">
                    ₹{fee.paid.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {fee.due > 0 ? (
                      <span className="text-destructive font-medium">
                        ₹{fee.due.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        fee.status === "paid"
                          ? "bg-success/10 text-success border-success/20"
                          : fee.status === "pending"
                          ? "bg-destructive/10 text-destructive border-destructive/20"
                          : "bg-warning/10 text-warning border-warning/20"
                      }
                    >
                      {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {fee.lastPayment
                      ? new Date(fee.lastPayment).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    {fee.due > 0 && (
                      <Button size="sm" variant="outline">
                        Collect
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SimpleCard>
    </div>
  );
}
