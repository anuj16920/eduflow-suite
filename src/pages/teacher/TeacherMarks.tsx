import { useState } from "react";
import {
  BarChart3,
  Save,
  Download,
  Users,
  GraduationCap,
  TrendingUp,
  Search,
  Edit,
} from "lucide-react";
import { SimpleCard, StatsCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface Student {
  id: string;
  name: string;
  rollNo: number;
  marks: { [key: string]: number | null };
}

interface Exam {
  id: string;
  name: string;
  maxMarks: number;
  date: string;
}

export default function TeacherMarks() {
  const { toast } = useToast();
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [classes] = useState<string[]>([]);
  const [exams] = useState<Exam[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [editingStudent, setEditingStudent] = useState<string | null>(null);

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateMark = (studentId: string, marks: number) => {
    setStudents(
      students.map((s) =>
        s.id === studentId
          ? { ...s, marks: { ...s.marks, [selectedExam]: marks } }
          : s
      )
    );
  };

  const handleSaveMarks = () => {
    toast({
      title: "Success",
      description: "Marks saved successfully",
    });
    setEditingStudent(null);
  };

  const getGrade = (marks: number, maxMarks: number) => {
    const percentage = (marks / maxMarks) * 100;
    if (percentage >= 90) return { grade: "A+", color: "bg-success/10 text-success" };
    if (percentage >= 80) return { grade: "A", color: "bg-success/10 text-success" };
    if (percentage >= 70) return { grade: "B+", color: "bg-primary/10 text-primary" };
    if (percentage >= 60) return { grade: "B", color: "bg-primary/10 text-primary" };
    if (percentage >= 50) return { grade: "C", color: "bg-warning/10 text-warning" };
    if (percentage >= 33) return { grade: "D", color: "bg-warning/10 text-warning" };
    return { grade: "F", color: "bg-destructive/10 text-destructive" };
  };

  const selectedExamDetails = exams.find((e) => e.id === selectedExam);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Marks Entry</h1>
          <p className="text-muted-foreground">Enter and manage student marks</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={handleSaveMarks}
            className="gradient-primary border-0"
            disabled={students.length === 0}
          >
            <Save className="h-4 w-4 mr-2" />
            Save All
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Students" value={students.length} icon={Users} />
        <StatsCard
          title="Marks Entered"
          value={students.filter((s) => s.marks[selectedExam] !== null).length}
          icon={GraduationCap}
          variant="success"
        />
        <StatsCard
          title="Pending"
          value={students.filter((s) => s.marks[selectedExam] === null).length}
          icon={Edit}
          variant="warning"
        />
        <StatsCard
          title="Class Average"
          value={
            students.length > 0
              ? Math.round(
                  students.reduce((acc, s) => acc + (s.marks[selectedExam] || 0), 0) /
                    students.filter((s) => s.marks[selectedExam] !== null).length || 0
                ) + "%"
              : "N/A"
          }
          icon={BarChart3}
          variant="primary"
        />
      </div>

      {/* Filters */}
      <SimpleCard>
        <div className="flex flex-col md:flex-row gap-4">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent>
              {classes.length === 0 ? (
                <SelectItem value="none" disabled>
                  No classes available
                </SelectItem>
              ) : (
                classes.map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    {cls}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <Select value={selectedExam} onValueChange={setSelectedExam}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Select Exam" />
            </SelectTrigger>
            <SelectContent>
              {exams.length === 0 ? (
                <SelectItem value="none" disabled>
                  No exams available
                </SelectItem>
              ) : (
                exams.map((exam) => (
                  <SelectItem key={exam.id} value={exam.id}>
                    {exam.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </SimpleCard>

      {/* Marks Table */}
      <SimpleCard title="Student Marks">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">No students found</p>
            <p className="text-sm text-muted-foreground">
              {!selectedClass || !selectedExam
                ? "Select a class and exam to view students"
                : "No students in this class"}
            </p>
          </div>
        ) : (
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Roll No</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead className="w-32 text-center">
                    Marks
                    {selectedExamDetails && (
                      <span className="text-muted-foreground">
                        {" "}
                        / {selectedExamDetails.maxMarks}
                      </span>
                    )}
                  </TableHead>
                  <TableHead className="w-24 text-center">Grade</TableHead>
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filteredStudents.map((student, index) => {
                    const marks = student.marks[selectedExam];
                    const maxMarks = selectedExamDetails?.maxMarks || 100;
                    const gradeInfo = marks !== null ? getGrade(marks, maxMarks) : null;

                    return (
                      <motion.tr
                        key={student.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="border-b"
                      >
                        <TableCell className="font-medium">{student.rollNo}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-medium text-primary">
                                {student.name.split(" ").map((n) => n[0]).join("")}
                              </span>
                            </div>
                            {student.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {editingStudent === student.id ? (
                            <Input
                              type="number"
                              min={0}
                              max={maxMarks}
                              value={marks || ""}
                              onChange={(e) =>
                                handleUpdateMark(student.id, parseInt(e.target.value) || 0)
                              }
                              className="w-20 mx-auto text-center"
                              autoFocus
                            />
                          ) : marks !== null ? (
                            <span className="font-medium">{marks}</span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {gradeInfo ? (
                            <Badge className={gradeInfo.color}>{gradeInfo.grade}</Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {editingStudent === student.id ? (
                            <Button size="sm" onClick={() => setEditingStudent(null)}>
                              Done
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingStudent(student.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        )}
      </SimpleCard>
    </div>
  );
}
