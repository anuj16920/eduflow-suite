import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Users,
  GraduationCap,
  CreditCard,
  FileText,
  PieChart,
} from "lucide-react";
import { SimpleCard, StatsCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPie,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";

const attendanceData = [
  { month: "Jan", present: 92, absent: 8 },
  { month: "Feb", present: 94, absent: 6 },
  { month: "Mar", present: 91, absent: 9 },
  { month: "Apr", present: 93, absent: 7 },
  { month: "May", present: 95, absent: 5 },
  { month: "Jun", present: 90, absent: 10 },
];

const feeCollectionData = [
  { month: "Jan", collected: 450000, pending: 50000 },
  { month: "Feb", collected: 480000, pending: 45000 },
  { month: "Mar", collected: 520000, pending: 30000 },
  { month: "Apr", collected: 490000, pending: 35000 },
  { month: "May", collected: 510000, pending: 40000 },
  { month: "Jun", collected: 550000, pending: 25000 },
];

const performanceData = [
  { subject: "Math", average: 78, highest: 98, lowest: 45 },
  { subject: "Science", average: 72, highest: 95, lowest: 38 },
  { subject: "English", average: 82, highest: 97, lowest: 52 },
  { subject: "Hindi", average: 75, highest: 94, lowest: 48 },
  { subject: "Social", average: 70, highest: 92, lowest: 42 },
];

const classDistribution = [
  { name: "Class 6", value: 180, color: "hsl(var(--primary))" },
  { name: "Class 7", value: 195, color: "hsl(var(--success))" },
  { name: "Class 8", value: 210, color: "hsl(var(--warning))" },
  { name: "Class 9", value: 225, color: "hsl(var(--accent))" },
  { name: "Class 10", value: 200, color: "hsl(var(--destructive))" },
];

const gradeDistribution = [
  { grade: "A+", students: 120 },
  { grade: "A", students: 280 },
  { grade: "B+", students: 350 },
  { grade: "B", students: 420 },
  { grade: "C+", students: 280 },
  { grade: "C", students: 150 },
  { grade: "D", students: 80 },
];

export default function ReportsAnalytics() {
  const [timeRange, setTimeRange] = useState("6months");

  const handleExport = (reportType: string) => {
    // In a real app, this would generate and download the report
    console.log(`Exporting ${reportType} report...`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive insights and data visualization</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Students"
          value="2,847"
          change={{ value: "12%", positive: true }}
          icon={GraduationCap}
        />
        <StatsCard
          title="Avg Attendance"
          value="93.2%"
          change={{ value: "2.1%", positive: true }}
          icon={Users}
          variant="success"
        />
        <StatsCard
          title="Fee Collection"
          value="₹24.5L"
          change={{ value: "8%", positive: true }}
          icon={CreditCard}
          variant="primary"
        />
        <StatsCard
          title="Avg Performance"
          value="75.4%"
          change={{ value: "3%", positive: true }}
          icon={BarChart3}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="attendance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="fees">Fees</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <SimpleCard
              title="Attendance Trend"
              className="lg:col-span-2"
              action={
                <Button size="sm" variant="outline" onClick={() => handleExport("attendance")}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              }
            >
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
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="present"
                      stroke="hsl(var(--success))"
                      fillOpacity={1}
                      fill="url(#colorPresent)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </SimpleCard>

            <SimpleCard title="Attendance Summary">
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-5xl font-bold text-success">93.2%</p>
                  <p className="text-muted-foreground">Average Attendance</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Present Today</span>
                    <span className="font-semibold">2,654</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Absent Today</span>
                    <span className="font-semibold text-destructive">193</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">On Leave</span>
                    <span className="font-semibold text-warning">45</span>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-success text-sm">
                    <TrendingUp className="h-4 w-4" />
                    <span>+2.1% from last month</span>
                  </div>
                </div>
              </div>
            </SimpleCard>
          </div>
        </TabsContent>

        {/* Fees Tab */}
        <TabsContent value="fees" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <SimpleCard
              title="Fee Collection Trend"
              className="lg:col-span-2"
              action={
                <Button size="sm" variant="outline" onClick={() => handleExport("fees")}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              }
            >
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={feeCollectionData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" tickFormatter={(v) => `₹${v / 1000}k`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [`₹${(value / 1000).toFixed(0)}k`, ""]}
                    />
                    <Legend />
                    <Bar dataKey="collected" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} name="Collected" />
                    <Bar dataKey="pending" fill="hsl(var(--warning))" radius={[4, 4, 0, 0]} name="Pending" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SimpleCard>

            <SimpleCard title="Fee Summary">
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-4xl font-bold">₹24.5L</p>
                  <p className="text-muted-foreground">Total Collected</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Collection Rate</span>
                      <span className="font-semibold">85%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full w-[85%] bg-success rounded-full" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pending Amount</span>
                    <span className="font-semibold text-warning">₹3.2L</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Students with Dues</span>
                    <span className="font-semibold">247</span>
                  </div>
                </div>
              </div>
            </SimpleCard>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <SimpleCard
              title="Subject-wise Performance"
              action={
                <Button size="sm" variant="outline" onClick={() => handleExport("performance")}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              }
            >
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" domain={[0, 100]} className="text-xs" />
                    <YAxis type="category" dataKey="subject" className="text-xs" width={60} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="average" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} name="Average" />
                    <Bar dataKey="highest" fill="hsl(var(--success))" radius={[0, 4, 4, 0]} name="Highest" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SimpleCard>

            <SimpleCard title="Grade Distribution">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={gradeDistribution}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="grade" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="students" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]}>
                      {gradeDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            index < 2
                              ? "hsl(var(--success))"
                              : index < 4
                              ? "hsl(var(--primary))"
                              : index < 6
                              ? "hsl(var(--warning))"
                              : "hsl(var(--destructive))"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SimpleCard>
          </div>
        </TabsContent>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <SimpleCard title="Class Distribution">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={classDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {classDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
            </SimpleCard>

            <SimpleCard title="Quick Reports">
              <div className="space-y-3">
                {[
                  { name: "Monthly Attendance Report", icon: Users },
                  { name: "Fee Collection Statement", icon: CreditCard },
                  { name: "Exam Results Summary", icon: FileText },
                  { name: "Teacher Performance", icon: BarChart3 },
                  { name: "Student Progress Cards", icon: GraduationCap },
                ].map((report, index) => (
                  <motion.div
                    key={report.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => handleExport(report.name)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <report.icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-medium">{report.name}</span>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </SimpleCard>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
