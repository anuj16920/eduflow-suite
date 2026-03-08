import { useState, useEffect, useMemo } from "react";
import { Download, Printer, CreditCard, AlertCircle, CheckCircle2, Wallet } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { SimpleCard, StatsCard } from "@/components/dashboard/StatsCard";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { StudentFeeSummaryCard, FeeBreakdownChart, PaymentHistoryTable } from "@/components/fees";
import type { PaymentRow } from "@/components/fees";
import { useToast } from "@/hooks/use-toast";

export default function StudentFeeStatusPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [feeStructures, setFeeStructures] = useState<any[]>([]);
  const [paymentsRaw, setPaymentsRaw] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [studentsRes, feeRes, payRes] = await Promise.all([
      supabase.from("students").select("*, profiles(*), classes(name, section)"),
      supabase.from("fee_structure").select("*"),
      supabase.from("fee_payments").select("*, fee_structure(name, amount)"),
    ]);
    if (studentsRes.data) {
      setStudents(studentsRes.data);
      if (studentsRes.data.length > 0) setSelectedStudent(studentsRes.data[0].id);
    }
    if (feeRes.data) setFeeStructures(feeRes.data);
    if (payRes.data) setPaymentsRaw(payRes.data);
    setLoading(false);
  };

  const currentStudent = useMemo(
    () => students.find((s) => s.id === selectedStudent),
    [students, selectedStudent]
  );

  const studentPayments: PaymentRow[] = useMemo(
    () =>
      paymentsRaw
        .filter((p) => p.student_id === selectedStudent)
        .map((p) => ({
          id: p.id,
          receiptNumber: p.receipt_number,
          paymentDate: p.payment_date,
          amountPaid: Number(p.amount_paid) || 0,
          paymentMethod: p.payment_method,
          status: p.status,
          feeName: p.fee_structure?.name || "Fee",
        })),
    [paymentsRaw, selectedStudent]
  );

  const totalFees = useMemo(() => {
    // Sum fee structures applicable to this student's class
    const classId = currentStudent?.class_id;
    return feeStructures
      .filter((f) => !f.class_id || f.class_id === classId)
      .reduce((s, f) => s + (Number(f.amount) || 0), 0);
  }, [feeStructures, currentStudent]);

  const totalPaid = useMemo(
    () => studentPayments.reduce((s, p) => s + p.amountPaid, 0),
    [studentPayments]
  );

  const pending = Math.max(0, totalFees - totalPaid);

  const handleCSV = () => {
    if (studentPayments.length === 0) return;
    const header = "Receipt,Date,Amount,Method,Status,Fee Type\n";
    const rows = studentPayments
      .map((p) =>
        `"${p.receiptNumber || ""}","${p.paymentDate || ""}",${p.amountPaid},"${p.paymentMethod || ""}","${p.status || ""}","${p.feeName}"`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fee-report-${currentStudent?.profiles?.full_name || "student"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exported", description: "CSV downloaded" });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Breadcrumb className="mb-2">
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink href="/admin/fees">Fees</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>Student Fees</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold">Fee Details</h1>
          <p className="text-muted-foreground">View fee payment details, balances, and payment history</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl" onClick={handleCSV}>
            <Download className="h-4 w-4 mr-2" /> Export Report
          </Button>
        </div>
      </div>

      {/* Student selector */}
      <Select value={selectedStudent} onValueChange={setSelectedStudent}>
        <SelectTrigger className="w-[280px] rounded-xl bg-muted/40 border-0">
          <SelectValue placeholder="Select Student" />
        </SelectTrigger>
        <SelectContent>
          {students.map((s) => (
            <SelectItem key={s.id} value={s.id}>
              {s.profiles?.full_name || "Student"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      ) : (
        <>
          {/* Student Summary */}
          {currentStudent && (
            <StudentFeeSummaryCard
              student={{
                name: currentStudent.profiles?.full_name || "Student",
                email: currentStudent.profiles?.email || "",
                avatarUrl: currentStudent.profiles?.avatar_url,
                admissionNumber: currentStudent.admission_number,
                className: currentStudent.classes
                  ? `${currentStudent.classes.name}${currentStudent.classes.section ? `-${currentStudent.classes.section}` : ""}`
                  : undefined,
              }}
            />
          )}

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatsCard title="Total Fees" value={`₹${totalFees.toLocaleString()}`} icon={Wallet} />
            <StatsCard title="Paid Amount" value={`₹${totalPaid.toLocaleString()}`} icon={CheckCircle2} variant="success" />
            <StatsCard
              title="Pending Balance"
              value={`₹${pending.toLocaleString()}`}
              icon={AlertCircle}
              variant={pending > 0 ? "warning" : "success"}
            />
          </div>

          {/* Chart + Table */}
          <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
            <SimpleCard title="Payment Breakdown">
              <FeeBreakdownChart paid={totalPaid} pending={pending} />
            </SimpleCard>

            <SimpleCard title="Payment History">
              <PaymentHistoryTable payments={studentPayments} />
            </SimpleCard>
          </div>
        </>
      )}
    </div>
  );
}
