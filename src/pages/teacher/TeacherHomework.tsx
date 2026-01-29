import { useState } from "react";
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Upload,
  Calendar,
  Clock,
  Users,
  FileText,
  Download,
  Eye,
} from "lucide-react";
import { SimpleCard, StatsCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface Homework {
  id: string;
  title: string;
  description: string;
  class: string;
  subject: string;
  dueDate: string;
  attachments: string[];
  submissions: number;
  totalStudents: number;
  status: "active" | "overdue" | "completed";
}

export default function TeacherHomework() {
  const { toast } = useToast();
  const [homework, setHomework] = useState<Homework[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [classes] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    class: "",
    subject: "",
    dueDate: "",
  });

  const handleAddHomework = () => {
    if (!formData.title || !formData.class || !formData.dueDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newHomework: Homework = {
      id: `HW${homework.length + 1}`,
      title: formData.title,
      description: formData.description,
      class: formData.class,
      subject: formData.subject,
      dueDate: formData.dueDate,
      attachments: [],
      submissions: 0,
      totalStudents: 35,
      status: "active",
    };

    setHomework([newHomework, ...homework]);
    setFormData({
      title: "",
      description: "",
      class: "",
      subject: "",
      dueDate: "",
    });
    setIsAddOpen(false);
    toast({
      title: "Success",
      description: "Homework assigned successfully",
    });
  };

  const handleDeleteHomework = (id: string) => {
    setHomework(homework.filter((h) => h.id !== id));
    toast({
      title: "Success",
      description: "Homework deleted",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-primary/10 text-primary";
      case "overdue":
        return "bg-destructive/10 text-destructive";
      case "completed":
        return "bg-success/10 text-success";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const activeCount = homework.filter((h) => h.status === "active").length;
  const overdueCount = homework.filter((h) => h.status === "overdue").length;
  const completedCount = homework.filter((h) => h.status === "completed").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Homework</h1>
          <p className="text-muted-foreground">Assign and manage homework for your classes</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary border-0 text-primary-foreground hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Assign Homework
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Assign New Homework</DialogTitle>
              <DialogDescription>Create a new homework assignment</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Chapter 5 Exercises"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Class *</Label>
                  <Select
                    value={formData.class}
                    onValueChange={(v) => setFormData({ ...formData, class: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
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
                </div>
                <div className="grid gap-2">
                  <Label>Subject</Label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g., Mathematics"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Due Date *</Label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the homework assignment..."
                  rows={4}
                />
              </div>
              <div className="grid gap-2">
                <Label>Attachments</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Drag and drop files here, or click to browse
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddHomework} className="gradient-primary border-0">
                Assign
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Assigned" value={homework.length} icon={BookOpen} />
        <StatsCard title="Active" value={activeCount} icon={Clock} variant="primary" />
        <StatsCard title="Overdue" value={overdueCount} icon={Calendar} variant="warning" />
        <StatsCard title="Completed" value={completedCount} icon={FileText} variant="success" />
      </div>

      {/* Homework List */}
      <SimpleCard title="Homework Assignments">
        <AnimatePresence mode="popLayout">
          {homework.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No homework assigned yet</p>
              <p className="text-sm text-muted-foreground">
                Click "Assign Homework" to create a new assignment
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {homework.map((hw, index) => (
                <motion.div
                  key={hw.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-xl border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{hw.title}</h3>
                        <Badge className={getStatusColor(hw.status)}>
                          {hw.status.charAt(0).toUpperCase() + hw.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {hw.description || "No description provided"}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {hw.class}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          {hw.subject}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Due: {hw.dueDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {hw.submissions}/{hw.totalStudents} submitted
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDeleteHomework(hw.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {hw.attachments.length > 0 && (
                    <div className="mt-3 pt-3 border-t flex flex-wrap gap-2">
                      {hw.attachments.map((file, i) => (
                        <Badge key={i} variant="secondary" className="gap-1">
                          <FileText className="h-3 w-3" />
                          {file}
                        </Badge>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </SimpleCard>
    </div>
  );
}
