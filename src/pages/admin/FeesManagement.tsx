import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SimpleCard, StatsCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Search, Plus, Download, CreditCard, TrendingUp, AlertCircle, CheckCircle,
  Receipt, FileText,
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function FeesManagement() {
  const [feeStructures, setFeeStructures] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddFeeOpen, setIsAddFeeOpen] = useState(false);
  const { toast } = useToast();

  const [feeForm, setFeeForm] = useState({
    name: "", amount: "", fee_type: "tuition", class_id: "", due_date: "",
  });

  useEffect(() => {
    Promise.all([fetchFeeStructures(), fetchPayments(), fetchClasses()]);
  }, []);

  const fetchFeeStructures = async () => {
    const { data } = await supabase.from("fee_structure").select("*, classes(*)");
    if (data) setFeeStructures(data);
  };

  const fetchPayments = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("fee_payments")
      .select("*, students(*, profiles(*)), fee_structure(*)");
    if (data) setPayments(data);
    setLoading(false);
  };

  const fetchClasses = async () => {
    const { data } = await supabase.from("classes").select("*");
    if (data) setClasses(data);
  };

  const handleAddFee = async () => {
    if (!feeForm.name || !feeForm.amount) {
      toast({ title: "Error", description: "Name and amount are required", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("fee_structure").insert({
      name: feeForm.name,
      amount: parseFloat(feeForm.amount),
      fee_type: feeForm.fee_type,
      class_id: feeForm.class_id || null,
      due_date: feeForm.due_date || null,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Fee structure created" });
      setIsAddFeeOpen(false);
      setFeeForm({ name: "", amount: "", fee_type: "tuition", class_id: "", due_date: "" });
      fetchFeeStructures();
    }
  };

  const totalCollected = payments.reduce((sum, p) => sum + (p.amount_paid || 0), 0);
  const totalPending = feeStructures.reduce((sum, f) => sum + (f.amount || 0), 0) - totalCollected;
  const paidCount = payments.filter((p) => p.status === "paid").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Fees & Accounts</h1>
          <p className="text-muted-foreground">Manage fee structures, collections and financial records</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline"><Download className="h-4 w-4 mr-2" />Export Report</Button>
          <Dialog open={isAddFeeOpen} onOpenChange={setIsAddFeeOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary border-0 text-primary-foreground hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />Add Fee Structure
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Fee Structure</DialogTitle>
                <DialogDescription>Define a new fee type for students</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Fee Name *</Label>
                  <Input value={feeForm.name} onChange={(e) => setFeeForm({ ...feeForm, name: e.target.value })} placeholder="e.g., Tuition Fee Q1" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Amount (₹) *</Label>
                    <Input type="number" value={feeForm.amount} onChange={(e) => setFeeForm({ ...feeForm, amount: e.target.value })} placeholder="25000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Fee Type</Label>
                    <Select value={feeForm.fee_type} onValueChange={(v) => setFeeForm({ ...feeForm, fee_type: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tuition">Tuition</SelectItem>
                        <SelectItem value="transport">Transport</SelectItem>
                        <SelectItem value="hostel">Hostel</SelectItem>
                        <SelectItem value="exam">Exam</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Class</Label>
                    <Select value={feeForm.class_id} onValueChange={(v) => setFeeForm({ ...feeForm, class_id: v })}>
                      <SelectTrigger><SelectValue placeholder="All classes" /></SelectTrigger>
                      <SelectContent>
                        {classes.map((c) => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Input type="date" value={feeForm.due_date} onChange={(e) => setFeeForm({ ...feeForm, due_date: e.target.value })} />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddFeeOpen(false)}>Cancel</Button>
                <Button className="gradient-primary border-0" onClick={handleAddFee}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <StatsCard title="Total Collected" value={`₹${(totalCollected / 100000).toFixed(1)}L`} icon={CreditCard} variant="primary" />
        <StatsCard title="Pending Dues" value={`₹${Math.max(0, totalPending / 100000).toFixed(1)}L`} icon={AlertCircle} variant="warning" />
        <StatsCard title="Payments Made" value={paidCount} icon={CheckCircle} variant="success" />
        <StatsCard title="Fee Structures" value={feeStructures.length} icon={FileText} />
      </div>

      <Tabs defaultValue="structures" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
          <TabsTrigger value="structures">Fee Structures</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="receipts">Receipts</TabsTrigger>
        </TabsList>

        <TabsContent value="structures">
          <SimpleCard title="Fee Structures">
            {feeStructures.length === 0 ? (
              <div className="text-center py-12">
                <CreditCard className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">No fee structures created yet</p>
                <p className="text-sm text-muted-foreground">Click "Add Fee Structure" to create one</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {feeStructures.map((fee, i) => (
                  <motion.div
                    key={fee.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-4 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{fee.name}</h4>
                        <p className="text-xs text-muted-foreground capitalize">{fee.fee_type}</p>
                      </div>
                      <Badge variant="secondary">{fee.classes?.name || "All"}</Badge>
                    </div>
                    <p className="text-2xl font-bold text-primary">₹{Number(fee.amount).toLocaleString()}</p>
                    {fee.due_date && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Due: {new Date(fee.due_date).toLocaleDateString("en-IN")}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </SimpleCard>
        </TabsContent>

        <TabsContent value="payments">
          <SimpleCard title="Recent Payments">
            {loading ? (
              <div className="text-center py-12">
                <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-3" />
                <p className="text-muted-foreground">Loading payments...</p>
              </div>
            ) : payments.length === 0 ? (
              <div className="text-center py-12">
                <Receipt className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">No payments recorded yet</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Fee Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.students?.profiles?.full_name || "—"}</TableCell>
                      <TableCell>{p.fee_structure?.name || "—"}</TableCell>
                      <TableCell className="text-right font-medium">₹{Number(p.amount_paid).toLocaleString()}</TableCell>
                      <TableCell className="capitalize">{p.payment_method}</TableCell>
                      <TableCell>{p.payment_date ? new Date(p.payment_date).toLocaleDateString("en-IN") : "—"}</TableCell>
                      <TableCell>
                        <Badge className="bg-success/10 text-success border-success/20">{p.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </SimpleCard>
        </TabsContent>

        <TabsContent value="receipts">
          <SimpleCard title="Fee Receipts">
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">Receipts are auto-generated for each payment</p>
              <p className="text-sm text-muted-foreground">Go to Payments tab to view and download receipts</p>
            </div>
          </SimpleCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
