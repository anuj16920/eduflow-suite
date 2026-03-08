import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SimpleCard, StatsCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  BarChart3, TrendingUp, Download, Calendar, Users, GraduationCap,
  CreditCard, FileText,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart as RechartsPie, Pie, Cell, Legend,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const attendanceData = [
  { month: "Jan", present: 92, absent: 8 },
  { month: "Feb", present: 94, absent: 6 },
  { month: "Mar", present: 91, absent: 9 },
  { month: "Apr", present: 93, absent: 7 },
  { month: "May", present: 95, absent: 5 },
  { month: "Jun", present: 90, absent: 10 },
];

const gradeDistribution = [
  { grade: "A+", students: 120, color: "hsl(var(--success))" },
  { grade: "A", students: 280, color: "hsl(var(--success))" },
  { grade: "B+", students: 350, color: "hsl(var(--primary))" },
  { grade: "B", students: 420, color: "hsl(var(--primary))" },
  { grade: "C+", students: 280, color: "hsl(var(--warning))" },
  { grade: "C", students: 150, color: "hsl(var(--warning))" },
  { grade: "D", students: 80, color: "hsl(var(--destructive))" },
];

export default function ReportsAnalytics() {
  const [students, setStudents] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [marks, setMarks] = useState<any[]>([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [timeRange, setTimeRange] = useState("6months");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [studentsRes, examsRes, marksRes] = await Promise.all([
      supabase.from("students").select("*, profiles(*)"),
      supabase.from("exams").select("*"),
      supabase.from("marks").select("*, students(*, profiles(*)), subjects(*), exams(*)"),
    ]);
    if (studentsRes.data) setStudents(studentsRes.data);
    if (examsRes.data) setExams(examsRes.data);
    if (marksRes.data) setMarks(marksRes.data);
  };

  const generateReportCard = (studentId?: string) => {
    const studentMarks = studentId ? marks.filter((m) => m.student_id === studentId) : marks;
    if (studentMarks.length === 0) {
      alert("No marks data available to generate report card.");
      return;
    }

    const student = studentMarks[0]?.students;
    const studentName = student?.profiles?.full_name || "Student";

    // Generate PDF-like content
    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Report Card - ${studentName}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Georgia', serif; background: #fff; color: #1a1a1a; padding: 40px; }
          .header { text-align: center; border-bottom: 3px double #d45500; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { font-size: 28px; color: #d45500; margin-bottom: 5px; }
          .header h2 { font-size: 18px; color: #666; font-weight: normal; }
          .student-info { display: flex; justify-content: space-between; margin-bottom: 30px; padding: 15px; background: #fff5ee; border-radius: 8px; }
          .student-info div { }
          .student-info label { font-size: 12px; color: #888; text-transform: uppercase; }
          .student-info p { font-size: 16px; font-weight: 600; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th { background: #d45500; color: white; padding: 12px 15px; text-align: left; font-size: 14px; }
          td { padding: 10px 15px; border-bottom: 1px solid #eee; font-size: 14px; }
          tr:nth-child(even) { background: #fafafa; }
          .grade-A { color: #16a34a; font-weight: 700; }
          .grade-B { color: #d45500; font-weight: 700; }
          .grade-C { color: #eab308; font-weight: 700; }
          .grade-D { color: #dc2626; font-weight: 700; }
          .summary { display: flex; justify-content: space-around; padding: 20px; background: linear-gradient(135deg, #d45500, #ff8c00); border-radius: 12px; color: white; }
          .summary div { text-align: center; }
          .summary .value { font-size: 28px; font-weight: 700; }
          .summary .label { font-size: 12px; opacity: 0.8; }
          .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #888; font-size: 12px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎓 EduCore Academy</h1>
          <h2>Academic Report Card</h2>
        </div>
        <div class="student-info">
          <div><label>Student Name</label><p>${studentName}</p></div>
          <div><label>Email</label><p>${student?.profiles?.email || "N/A"}</p></div>
          <div><label>Exam</label><p>${studentMarks[0]?.exams?.name || "Final Exam"}</p></div>
          <div><label>Date</label><p>${new Date().toLocaleDateString("en-IN")}</p></div>
        </div>
        <table>
          <thead>
            <tr><th>Subject</th><th>Marks Obtained</th><th>Max Marks</th><th>Percentage</th><th>Grade</th></tr>
          </thead>
          <tbody>
    `;

    let totalObtained = 0;
    let totalMax = 0;

    studentMarks.forEach((m) => {
      const obtained = m.marks_obtained || 0;
      const max = m.max_marks || 100;
      const pct = ((obtained / max) * 100).toFixed(1);
      const grade = obtained / max >= 0.9 ? "A+" : obtained / max >= 0.8 ? "A" : obtained / max >= 0.7 ? "B+" : obtained / max >= 0.6 ? "B" : obtained / max >= 0.5 ? "C" : "D";
      const gradeClass = grade.startsWith("A") ? "grade-A" : grade.startsWith("B") ? "grade-B" : grade.startsWith("C") ? "grade-C" : "grade-D";
      totalObtained += obtained;
      totalMax += max;
      htmlContent += `<tr><td>${m.subjects?.name || "Subject"}</td><td>${obtained}</td><td>${max}</td><td>${pct}%</td><td class="${gradeClass}">${grade}</td></tr>`;
    });

    const overallPct = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(1) : "0";
    const overallGrade = parseFloat(overallPct) >= 90 ? "A+" : parseFloat(overallPct) >= 80 ? "A" : parseFloat(overallPct) >= 70 ? "B+" : parseFloat(overallPct) >= 60 ? "B" : parseFloat(overallPct) >= 50 ? "C" : "D";

    htmlContent += `
          </tbody>
        </table>
        <div class="summary">
          <div><div class="value">${totalObtained}/${totalMax}</div><div class="label">Total Marks</div></div>
          <div><div class="value">${overallPct}%</div><div class="label">Percentage</div></div>
          <div><div class="value">${overallGrade}</div><div class="label">Overall Grade</div></div>
          <div><div class="value">${studentMarks.length}</div><div class="label">Subjects</div></div>
        </div>
        <div class="footer">
          <p>Generated by EduCore Academy Management System on ${new Date().toLocaleString("en-IN")}</p>
          <p>This is a computer-generated report card.</p>
        </div>
      </body>
      </html>
    `;

    // Open in new window for printing/saving as PDF
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 500);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive insights, report cards, and data visualization</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40"><Calendar className="h-4 w-4 mr-2" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => generateReportCard()}>
            <Download className="h-4 w-4 mr-2" />Download Report Card
          </Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Students" value={students.length} icon={GraduationCap} change={{ value: "12%", positive: true }} />
        <StatsCard title="Avg Attendance" value="93.2%" icon={Users} variant="success" change={{ value: "2.1%", positive: true }} />
        <StatsCard title="Exams Conducted" value={exams.length} icon={FileText} variant="primary" />
        <StatsCard title="Marks Entries" value={marks.length} icon={BarChart3} variant="warning" />
      </div>

      <Tabs defaultValue="reportcards" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
          <TabsTrigger value="reportcards">Report Cards</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="grades">Grades</TabsTrigger>
        </TabsList>

        <TabsContent value="reportcards">
          <SimpleCard title="Student Report Cards" description="Select a student to generate and download their report card as PDF">
            {students.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">No students found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-medium text-primary">
                              {(s.profiles?.full_name || "?").split(" ").map((n: string) => n[0]).join("")}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{s.profiles?.full_name}</p>
                            <p className="text-xs text-muted-foreground">{s.profiles?.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="secondary">{s.admission_number || "—"}</Badge></TableCell>
                      <TableCell>
                        <Badge className="bg-success/10 text-success">{s.status || "active"}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" onClick={() => generateReportCard(s.id)}>
                          <Download className="h-4 w-4 mr-2" />Report Card
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </SimpleCard>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-6">
          <SimpleCard title="Attendance Trend">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceData}>
                  <defs>
                    <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" domain={[80, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Area type="monotone" dataKey="present" stroke="hsl(var(--success))" fillOpacity={1} fill="url(#colorPresent)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </SimpleCard>
        </TabsContent>

        <TabsContent value="performance">
          <SimpleCard title="Subject Performance (from marks data)">
            {marks.length === 0 ? (
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">No marks data available yet</p>
                <p className="text-sm text-muted-foreground">Teachers need to enter marks first</p>
              </div>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={
                    Object.values(marks.reduce((acc: any, m) => {
                      const subName = m.subjects?.name || "Unknown";
                      if (!acc[subName]) acc[subName] = { subject: subName, total: 0, count: 0 };
                      acc[subName].total += (m.marks_obtained || 0);
                      acc[subName].count += 1;
                      return acc;
                    }, {})).map((s: any) => ({ ...s, average: Math.round(s.total / s.count) }))
                  }>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="subject" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                    <Bar dataKey="average" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Average Marks" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </SimpleCard>
        </TabsContent>

        <TabsContent value="grades">
          <SimpleCard title="Grade Distribution">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="grade" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Bar dataKey="students" radius={[4, 4, 0, 0]}>
                    {gradeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SimpleCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
