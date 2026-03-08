import { StatsCard, SimpleCard } from "@/components/dashboard/StatsCard";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Award, TrendingUp, BookOpen } from "lucide-react";

const results = [
  { subject: "Mathematics", marks: 92, maxMarks: 100, grade: "A+" },
  { subject: "Physics", marks: 85, maxMarks: 100, grade: "A" },
  { subject: "Chemistry", marks: 78, maxMarks: 100, grade: "B+" },
  { subject: "English", marks: 90, maxMarks: 100, grade: "A+" },
  { subject: "Biology", marks: 88, maxMarks: 100, grade: "A" },
];
const total = results.reduce((s, r) => s + r.marks, 0);
const maxTotal = results.reduce((s, r) => s + r.maxMarks, 0);
const percentage = ((total / maxTotal) * 100).toFixed(1);

export default function StudentResults() {
  return (
    <div className="space-y-8">
      <div><h1 className="text-3xl font-bold">Results</h1><p className="text-muted-foreground">Your examination results</p></div>
      <div className="grid sm:grid-cols-3 gap-4">
        <StatsCard title="Total Marks" value={`${total}/${maxTotal}`} icon={BookOpen} variant="primary" />
        <StatsCard title="Percentage" value={`${percentage}%`} icon={TrendingUp} variant="success" />
        <StatsCard title="Overall Grade" value="A" icon={Award} variant="warning" />
      </div>
      <SimpleCard title="Subject-wise Results">
        <Table>
          <TableHeader><TableRow className="border-border/30"><TableHead>Subject</TableHead><TableHead className="text-right">Marks</TableHead><TableHead className="text-right">Max</TableHead><TableHead className="text-right">%</TableHead><TableHead className="text-right">Grade</TableHead></TableRow></TableHeader>
          <TableBody>{results.map((r) => (
            <TableRow key={r.subject} className="border-border/20 hover:bg-muted/30">
              <TableCell className="font-medium">{r.subject}</TableCell><TableCell className="text-right">{r.marks}</TableCell><TableCell className="text-right text-muted-foreground">{r.maxMarks}</TableCell><TableCell className="text-right">{((r.marks / r.maxMarks) * 100).toFixed(0)}%</TableCell>
              <TableCell className="text-right"><Badge className={r.grade.startsWith("A") ? "bg-emerald-500/10 text-emerald-500" : "bg-primary/10 text-primary"}>{r.grade}</Badge></TableCell>
            </TableRow>
          ))}</TableBody>
        </Table>
      </SimpleCard>
    </div>
  );
}
