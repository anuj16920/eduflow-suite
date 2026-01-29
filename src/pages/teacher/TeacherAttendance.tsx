import { useState } from "react";
import {
  Users,
  Check,
  X,
  Calendar,
  Clock,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  Save,
} from "lucide-react";
import { SimpleCard, StatsCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  status: "present" | "absent" | "late" | null;
}

export default function TeacherAttendance() {
  const { toast } = useToast();
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [classes] = useState<string[]>([]);

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const presentCount = students.filter((s) => s.status === "present").length;
  const absentCount = students.filter((s) => s.status === "absent").length;
  const lateCount = students.filter((s) => s.status === "late").length;
  const unmarkedCount = students.filter((s) => s.status === null).length;

  const handleMarkAttendance = (studentId: string, status: "present" | "absent" | "late") => {
    setStudents(students.map((s) => (s.id === studentId ? { ...s, status } : s)));
  };

  const handleMarkAllPresent = () => {
    setStudents(students.map((s) => ({ ...s, status: "present" })));
    toast({
      title: "Success",
      description: "All students marked as present",
    });
  };

  const handleSaveAttendance = () => {
    if (unmarkedCount > 0) {
      toast({
        title: "Warning",
        description: `${unmarkedCount} students are still unmarked`,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Success",
      description: "Attendance saved successfully",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Attendance</h1>
          <p className="text-muted-foreground">Mark and manage student attendance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleMarkAllPresent} disabled={students.length === 0}>
            <Check className="h-4 w-4 mr-2" />
            Mark All Present
          </Button>
          <Button
            onClick={handleSaveAttendance}
            className="gradient-primary border-0"
            disabled={students.length === 0}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Attendance
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Present" value={presentCount} icon={Check} variant="success" />
        <StatsCard title="Absent" value={absentCount} icon={X} variant="destructive" />
        <StatsCard title="Late" value={lateCount} icon={Clock} variant="warning" />
        <StatsCard title="Unmarked" value={unmarkedCount} icon={Users} />
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
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const date = new Date(selectedDate);
                date.setDate(date.getDate() - 1);
                setSelectedDate(date.toISOString().split("T")[0]);
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-40"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const date = new Date(selectedDate);
                date.setDate(date.getDate() + 1);
                setSelectedDate(date.toISOString().split("T")[0]);
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </SimpleCard>

      {/* Attendance List */}
      <SimpleCard title="Students">
        <AnimatePresence mode="popLayout">
          {filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No students found</p>
              <p className="text-sm text-muted-foreground">
                {!selectedClass
                  ? "Select a class to view students"
                  : "No students in this class"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredStudents.map((student, index) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.02 }}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {student.rollNo}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">Roll No. {student.rollNo}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant={student.status === "present" ? "default" : "outline"}
                      className={
                        student.status === "present"
                          ? "bg-success hover:bg-success/90"
                          : ""
                      }
                      onClick={() => handleMarkAttendance(student.id, "present")}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={student.status === "absent" ? "default" : "outline"}
                      className={
                        student.status === "absent"
                          ? "bg-destructive hover:bg-destructive/90"
                          : ""
                      }
                      onClick={() => handleMarkAttendance(student.id, "absent")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={student.status === "late" ? "default" : "outline"}
                      className={
                        student.status === "late"
                          ? "bg-warning hover:bg-warning/90 text-warning-foreground"
                          : ""
                      }
                      onClick={() => handleMarkAttendance(student.id, "late")}
                    >
                      <Clock className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </SimpleCard>
    </div>
  );
}
