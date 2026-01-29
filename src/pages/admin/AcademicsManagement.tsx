import { useState } from "react";
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Clock,
  Calendar,
  GraduationCap,
  FileText,
  Users,
  ChevronRight,
} from "lucide-react";
import { SimpleCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface ClassSection {
  id: string;
  className: string;
  section: string;
  classTeacher: string;
  strength: number;
  subjects: string[];
}

interface Subject {
  id: string;
  name: string;
  code: string;
  classes: string[];
  teacher: string;
}

interface TimetableSlot {
  id: string;
  day: string;
  time: string;
  class: string;
  subject: string;
  teacher: string;
  room: string;
}

interface Exam {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  classes: string[];
  status: "upcoming" | "ongoing" | "completed";
}

export default function AcademicsManagement() {
  const [classes, setClasses] = useState<ClassSection[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [isAddTimetableOpen, setIsAddTimetableOpen] = useState(false);
  const [isAddExamOpen, setIsAddExamOpen] = useState(false);
  
  const { toast } = useToast();

  const [classForm, setClassForm] = useState({
    className: "",
    section: "",
    classTeacher: "",
  });

  const [subjectForm, setSubjectForm] = useState({
    name: "",
    code: "",
    teacher: "",
  });

  const [timetableForm, setTimetableForm] = useState({
    day: "",
    time: "",
    class: "",
    subject: "",
    teacher: "",
    room: "",
  });

  const [examForm, setExamForm] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const timeSlots = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM"];

  const handleAddClass = () => {
    if (!classForm.className || !classForm.section) {
      toast({ title: "Error", description: "Please fill required fields", variant: "destructive" });
      return;
    }
    const newClass: ClassSection = {
      id: `C${classes.length + 1}`,
      className: classForm.className,
      section: classForm.section,
      classTeacher: classForm.classTeacher,
      strength: 0,
      subjects: [],
    };
    setClasses([...classes, newClass]);
    setClassForm({ className: "", section: "", classTeacher: "" });
    setIsAddClassOpen(false);
    toast({ title: "Success", description: "Class created successfully" });
  };

  const handleAddSubject = () => {
    if (!subjectForm.name || !subjectForm.code) {
      toast({ title: "Error", description: "Please fill required fields", variant: "destructive" });
      return;
    }
    const newSubject: Subject = {
      id: `S${subjects.length + 1}`,
      name: subjectForm.name,
      code: subjectForm.code,
      teacher: subjectForm.teacher,
      classes: [],
    };
    setSubjects([...subjects, newSubject]);
    setSubjectForm({ name: "", code: "", teacher: "" });
    setIsAddSubjectOpen(false);
    toast({ title: "Success", description: "Subject added successfully" });
  };

  const handleAddTimetable = () => {
    if (!timetableForm.day || !timetableForm.time || !timetableForm.class) {
      toast({ title: "Error", description: "Please fill required fields", variant: "destructive" });
      return;
    }
    const newSlot: TimetableSlot = {
      id: `T${timetable.length + 1}`,
      ...timetableForm,
    };
    setTimetable([...timetable, newSlot]);
    setTimetableForm({ day: "", time: "", class: "", subject: "", teacher: "", room: "" });
    setIsAddTimetableOpen(false);
    toast({ title: "Success", description: "Timetable slot added" });
  };

  const handleAddExam = () => {
    if (!examForm.name || !examForm.startDate) {
      toast({ title: "Error", description: "Please fill required fields", variant: "destructive" });
      return;
    }
    const newExam: Exam = {
      id: `E${exams.length + 1}`,
      name: examForm.name,
      startDate: examForm.startDate,
      endDate: examForm.endDate,
      classes: [],
      status: "upcoming",
    };
    setExams([...exams, newExam]);
    setExamForm({ name: "", startDate: "", endDate: "" });
    setIsAddExamOpen(false);
    toast({ title: "Success", description: "Exam scheduled successfully" });
  };

  const handleDeleteClass = (id: string) => {
    setClasses(classes.filter((c) => c.id !== id));
    toast({ title: "Success", description: "Class deleted" });
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects(subjects.filter((s) => s.id !== id));
    toast({ title: "Success", description: "Subject deleted" });
  };

  const handleDeleteExam = (id: string) => {
    setExams(exams.filter((e) => e.id !== id));
    toast({ title: "Success", description: "Exam deleted" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Academic Management</h1>
          <p className="text-muted-foreground">Manage classes, subjects, timetables, and exams</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{classes.length}</p>
              <p className="text-sm text-muted-foreground">Classes</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-xl bg-gradient-to-br from-success/10 to-success/5 border"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <BookOpen className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{subjects.length}</p>
              <p className="text-sm text-muted-foreground">Subjects</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-xl bg-gradient-to-br from-warning/10 to-warning/5 border"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{timetable.length}</p>
              <p className="text-sm text-muted-foreground">Time Slots</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <FileText className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{exams.length}</p>
              <p className="text-sm text-muted-foreground">Exams</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="classes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="timetable">Timetable</TabsTrigger>
          <TabsTrigger value="exams">Exams</TabsTrigger>
        </TabsList>

        {/* Classes Tab */}
        <TabsContent value="classes">
          <SimpleCard
            title="Classes & Sections"
            action={
              <Dialog open={isAddClassOpen} onOpenChange={setIsAddClassOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gradient-primary border-0">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Class
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Class</DialogTitle>
                    <DialogDescription>Create a new class and section</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>Class Name *</Label>
                      <Input
                        value={classForm.className}
                        onChange={(e) => setClassForm({ ...classForm, className: e.target.value })}
                        placeholder="e.g., Class 10"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Section *</Label>
                      <Input
                        value={classForm.section}
                        onChange={(e) => setClassForm({ ...classForm, section: e.target.value })}
                        placeholder="e.g., A"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Class Teacher</Label>
                      <Input
                        value={classForm.classTeacher}
                        onChange={(e) => setClassForm({ ...classForm, classTeacher: e.target.value })}
                        placeholder="Teacher name"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddClassOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddClass} className="gradient-primary border-0">Create</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            }
          >
            <AnimatePresence mode="popLayout">
              {classes.length === 0 ? (
                <div className="text-center py-12">
                  <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No classes created yet</p>
                  <p className="text-sm text-muted-foreground">Click "Add Class" to create one</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {classes.map((cls, index) => (
                    <motion.div
                      key={cls.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 rounded-xl border bg-card hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <GraduationCap className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{cls.className}-{cls.section}</h3>
                            <p className="text-sm text-muted-foreground">{cls.classTeacher || "No teacher assigned"}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDeleteClass(cls.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          <Users className="h-4 w-4 inline mr-1" />
                          {cls.strength} Students
                        </span>
                        <Badge variant="secondary">{cls.subjects.length} Subjects</Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </SimpleCard>
        </TabsContent>

        {/* Subjects Tab */}
        <TabsContent value="subjects">
          <SimpleCard
            title="Subjects"
            action={
              <Dialog open={isAddSubjectOpen} onOpenChange={setIsAddSubjectOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gradient-primary border-0">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Subject
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Subject</DialogTitle>
                    <DialogDescription>Create a new subject</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>Subject Name *</Label>
                      <Input
                        value={subjectForm.name}
                        onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                        placeholder="e.g., Mathematics"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Subject Code *</Label>
                      <Input
                        value={subjectForm.code}
                        onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                        placeholder="e.g., MATH101"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Teacher</Label>
                      <Input
                        value={subjectForm.teacher}
                        onChange={(e) => setSubjectForm({ ...subjectForm, teacher: e.target.value })}
                        placeholder="Teacher name"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddSubjectOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddSubject} className="gradient-primary border-0">Add</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            }
          >
            <AnimatePresence mode="popLayout">
              {subjects.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No subjects added yet</p>
                  <p className="text-sm text-muted-foreground">Click "Add Subject" to add one</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {subjects.map((subject, index) => (
                    <motion.div
                      key={subject.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-success" />
                        </div>
                        <div>
                          <h3 className="font-medium">{subject.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {subject.code} • {subject.teacher || "No teacher assigned"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{subject.classes.length} Classes</Badge>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDeleteSubject(subject.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </SimpleCard>
        </TabsContent>

        {/* Timetable Tab */}
        <TabsContent value="timetable">
          <SimpleCard
            title="Timetable"
            action={
              <Dialog open={isAddTimetableOpen} onOpenChange={setIsAddTimetableOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gradient-primary border-0">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Slot
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Timetable Slot</DialogTitle>
                    <DialogDescription>Create a new timetable entry</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Day *</Label>
                        <Select
                          value={timetableForm.day}
                          onValueChange={(v) => setTimetableForm({ ...timetableForm, day: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select day" />
                          </SelectTrigger>
                          <SelectContent>
                            {days.map((day) => (
                              <SelectItem key={day} value={day}>{day}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Time *</Label>
                        <Select
                          value={timetableForm.time}
                          onValueChange={(v) => setTimetableForm({ ...timetableForm, time: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>{time}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label>Class *</Label>
                      <Input
                        value={timetableForm.class}
                        onChange={(e) => setTimetableForm({ ...timetableForm, class: e.target.value })}
                        placeholder="e.g., 10-A"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Subject</Label>
                      <Input
                        value={timetableForm.subject}
                        onChange={(e) => setTimetableForm({ ...timetableForm, subject: e.target.value })}
                        placeholder="Subject name"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Teacher</Label>
                        <Input
                          value={timetableForm.teacher}
                          onChange={(e) => setTimetableForm({ ...timetableForm, teacher: e.target.value })}
                          placeholder="Teacher name"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Room</Label>
                        <Input
                          value={timetableForm.room}
                          onChange={(e) => setTimetableForm({ ...timetableForm, room: e.target.value })}
                          placeholder="e.g., Room 101"
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddTimetableOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddTimetable} className="gradient-primary border-0">Add</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            }
          >
            {timetable.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">No timetable entries yet</p>
                <p className="text-sm text-muted-foreground">Click "Add Slot" to create one</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="grid gap-2">
                  {timetable.map((slot, index) => (
                    <motion.div
                      key={slot.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">{slot.day}</Badge>
                        <span className="font-medium">{slot.time}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        <span>{slot.class}</span>
                        <span className="text-muted-foreground">•</span>
                        <span>{slot.subject}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{slot.teacher}</span>
                        <span>•</span>
                        <span>{slot.room}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </SimpleCard>
        </TabsContent>

        {/* Exams Tab */}
        <TabsContent value="exams">
          <SimpleCard
            title="Exam Schedule"
            action={
              <Dialog open={isAddExamOpen} onOpenChange={setIsAddExamOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gradient-primary border-0">
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Exam
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Schedule Exam</DialogTitle>
                    <DialogDescription>Create a new exam schedule</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>Exam Name *</Label>
                      <Input
                        value={examForm.name}
                        onChange={(e) => setExamForm({ ...examForm, name: e.target.value })}
                        placeholder="e.g., Mid-Term Examination"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Start Date *</Label>
                        <Input
                          type="date"
                          value={examForm.startDate}
                          onChange={(e) => setExamForm({ ...examForm, startDate: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={examForm.endDate}
                          onChange={(e) => setExamForm({ ...examForm, endDate: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddExamOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddExam} className="gradient-primary border-0">Schedule</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            }
          >
            <AnimatePresence mode="popLayout">
              {exams.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No exams scheduled yet</p>
                  <p className="text-sm text-muted-foreground">Click "Schedule Exam" to create one</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {exams.map((exam, index) => (
                    <motion.div
                      key={exam.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 rounded-xl border bg-card"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{exam.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {exam.startDate} {exam.endDate && `- ${exam.endDate}`}
                          </p>
                        </div>
                        <Badge
                          className={
                            exam.status === "upcoming"
                              ? "bg-primary/10 text-primary"
                              : exam.status === "ongoing"
                              ? "bg-warning/10 text-warning"
                              : "bg-success/10 text-success"
                          }
                        >
                          {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {exam.classes.length} classes
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDeleteExam(exam.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </SimpleCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
