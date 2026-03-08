import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart3 } from "lucide-react";

const results = [
  { subject: "Mathematics", marks: 88, max: 100, grade: "A" },
  { subject: "Physics", marks: 76, max: 100, grade: "B+" },
  { subject: "Chemistry", marks: 82, max: 100, grade: "A-" },
  { subject: "English", marks: 91, max: 100, grade: "A+" },
  { subject: "Computer Science", marks: 95, max: 100, grade: "A+" },
  { subject: "Hindi", marks: 78, max: 100, grade: "B+" },
];

const total = results.reduce((s, r) => s + r.marks, 0);
const maxTotal = results.reduce((s, r) => s + r.max, 0);
const percentage = ((total / maxTotal) * 100).toFixed(1);

export default function StudentResults() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Results</h1>
        <p className="text-muted-foreground">Mid-Term Examination 2025-2026</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="p-4 text-center"><p className="text-sm text-muted-foreground">Total Marks</p><p className="text-3xl font-bold">{total}/{maxTotal}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-sm text-muted-foreground">Percentage</p><p className="text-3xl font-bold text-primary">{percentage}%</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-sm text-muted-foreground">Overall Grade</p><p className="text-3xl font-bold text-success">A</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" /> Subject-wise Results</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Marks Obtained</TableHead>
                <TableHead>Max Marks</TableHead>
                <TableHead>Percentage</TableHead>
                <TableHead>Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((r) => (
                <TableRow key={r.subject}>
                  <TableCell className="font-medium">{r.subject}</TableCell>
                  <TableCell>{r.marks}</TableCell>
                  <TableCell>{r.max}</TableCell>
                  <TableCell>{((r.marks / r.max) * 100).toFixed(0)}%</TableCell>
                  <TableCell><Badge variant="outline">{r.grade}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
