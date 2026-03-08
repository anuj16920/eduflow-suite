import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SimpleCard, StatsCard, GlassCard } from "@/components/dashboard/StatsCard";
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
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Search, Plus, MoreHorizontal, Eye, Edit, Trash2, Download, GraduationCap,
  UserPlus, ArrowUpDown, Users,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";

export default function StudentsManagement() {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "all";
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const { toast } = useToast();

  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", gender: "",
    class_id: "", roll_number: "", admission_number: "", blood_group: "",
  });

  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("students")
      .select("*, profiles(*), classes(*)");
    if (!error && data) setStudents(data);
    setLoading(false);
  };

  const fetchClasses = async () => {
    const { data } = await supabase.from("classes").select("*");
    if (data) setClasses(data);
  };

  const filteredStudents = students.filter((s) => {
    const name = s.profiles?.full_name?.toLowerCase() || "";
    const admNo = s.admission_number?.toLowerCase() || "";
    const q = searchQuery.toLowerCase();
    return name.includes(q) || admNo.includes(q);
  });

  const activeStudents = filteredStudents.filter((s) => s.status === "active");
  const totalBoys = students.filter((s) => s.profiles?.gender === "male").length;
  const totalGirls = students.filter((s) => s.profiles?.gender === "female").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Students Management</h1>
          <p className="text-muted-foreground">Manage student records, admissions, and promotions</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary border-0 text-primary-foreground hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>Fill in the student details below</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Student name" />
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="student@email.com" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Class</Label>
                  <Select value={form.class_id} onValueChange={(v) => setForm({ ...form, class_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                    <SelectContent>
                      {classes.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name} {c.section && `- ${c.section}`}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Roll Number</Label>
                  <Input type="number" value={form.roll_number} onChange={(e) => setForm({ ...form, roll_number: e.target.value })} placeholder="1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Admission Number</Label>
                  <Input value={form.admission_number} onChange={(e) => setForm({ ...form, admission_number: e.target.value })} placeholder="ADM-2025-001" />
                </div>
                <div className="space-y-2">
                  <Label>Blood Group</Label>
                  <Select value={form.blood_group} onValueChange={(v) => setForm({ ...form, blood_group: v })}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                        <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button className="gradient-primary border-0" onClick={() => {
                toast({ title: "Info", description: "Student registration requires creating an account first via the signup flow." });
                setIsAddOpen(false);
              }}>Add Student</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <StatsCard title="Total Students" value={students.length} icon={GraduationCap} />
        <StatsCard title="Boys" value={totalBoys} icon={Users} variant="primary" />
        <StatsCard title="Girls" value={totalGirls} icon={Users} variant="success" />
        <StatsCard title="Active" value={activeStudents.length} icon={UserPlus} variant="warning" />
      </div>

      {/* Tabs */}
      <Tabs defaultValue={defaultTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
          <TabsTrigger value="all">All Students</TabsTrigger>
          <TabsTrigger value="admissions">Admissions</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <SimpleCard>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search students..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
              </div>
              <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Export</Button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-3" />
                <p className="text-muted-foreground">Loading students...</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-12">
                <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">No students found</p>
                <p className="text-sm text-muted-foreground">Students will appear here once they sign up</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Admission #</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Roll No</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-medium text-primary">
                                {(student.profiles?.full_name || "?").split(" ").map((n: string) => n[0]).join("")}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{student.profiles?.full_name}</p>
                              <p className="text-xs text-muted-foreground">{student.profiles?.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{student.admission_number || "—"}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{student.classes?.name || "Unassigned"}</Badge>
                        </TableCell>
                        <TableCell>{student.roll_number || "—"}</TableCell>
                        <TableCell>
                          <Badge className={student.status === "active" ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning border-warning/20"}>
                            {student.status || "active"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem><Eye className="h-4 w-4 mr-2" />View Profile</DropdownMenuItem>
                              <DropdownMenuItem><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </SimpleCard>
        </TabsContent>

        <TabsContent value="admissions">
          <SimpleCard title="New Admissions" description="Manage new student admissions for the current academic year">
            <div className="text-center py-12">
              <UserPlus className="h-12 w-12 mx-auto text-primary/50 mb-3" />
              <h3 className="font-semibold text-lg mb-1">Admission Portal</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                New admissions are processed through the student signup flow. Students signing up with the "Student" role are automatically enrolled.
              </p>
              <Button className="mt-4 gradient-primary border-0 text-primary-foreground" onClick={() => setIsAddOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />Register New Student
              </Button>
            </div>
          </SimpleCard>
        </TabsContent>

        <TabsContent value="promotions">
          <SimpleCard title="Student Promotions" description="Promote students to the next class/grade">
            <div className="text-center py-12">
              <ArrowUpDown className="h-12 w-12 mx-auto text-primary/50 mb-3" />
              <h3 className="font-semibold text-lg mb-1">Bulk Promotion</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Select a class and promote all eligible students to the next level. This will update their class assignments for the new academic year.
              </p>
              <div className="flex items-center gap-3 justify-center mt-4">
                <Select>
                  <SelectTrigger className="w-48"><SelectValue placeholder="From Class" /></SelectTrigger>
                  <SelectContent>
                    {classes.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-muted-foreground">→</span>
                <Select>
                  <SelectTrigger className="w-48"><SelectValue placeholder="To Class" /></SelectTrigger>
                  <SelectContent>
                    {classes.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="mt-4 gradient-primary border-0 text-primary-foreground">
                Promote Students
              </Button>
            </div>
          </SimpleCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
