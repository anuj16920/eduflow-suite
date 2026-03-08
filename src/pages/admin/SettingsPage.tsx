import { useState } from "react";
import {
  Settings,
  School,
  Calendar,
  Award,
  Shield,
  Palette,
  Save,
  Bell,
  Globe,
  Mail,
  MessageSquare,
  CreditCard,
  FileText,
  Users,
} from "lucide-react";
import { SimpleCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { InstitutionSettingsForm, BrandingSettingsPanel, PlatformPreferencesPanel } from "@/components/settings";

interface AcademicSettings {
  currentSession: string;
  startMonth: string;
  endMonth: string;
  workingDays: string[];
}

interface GradingSettings {
  system: "percentage" | "grades" | "cgpa";
  passingScore: number;
  grades: { grade: string; minScore: number; maxScore: number }[];
}

interface Role {
  id: string;
  name: string;
  permissions: string[];
}

export default function SettingsPage() {
  const { toast } = useToast();

  const [academicSettings, setAcademicSettings] = useState<AcademicSettings>({
    currentSession: "2024-25",
    startMonth: "April",
    endMonth: "March",
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  });

  const [gradingSettings, setGradingSettings] = useState<GradingSettings>({
    system: "percentage",
    passingScore: 33,
    grades: [
      { grade: "A+", minScore: 90, maxScore: 100 },
      { grade: "A", minScore: 80, maxScore: 89 },
      { grade: "B+", minScore: 70, maxScore: 79 },
      { grade: "B", minScore: 60, maxScore: 69 },
      { grade: "C", minScore: 50, maxScore: 59 },
      { grade: "D", minScore: 33, maxScore: 49 },
      { grade: "F", minScore: 0, maxScore: 32 },
    ],
  });

  const [roles] = useState<Role[]>([
    { id: "1", name: "Super Admin", permissions: ["all"] },
    { id: "2", name: "Admin", permissions: ["manage_students", "manage_teachers", "manage_fees", "view_reports"] },
    { id: "3", name: "Teacher", permissions: ["view_students", "mark_attendance", "upload_marks"] },
    { id: "4", name: "Parent", permissions: ["view_student", "view_fees", "view_reports"] },
  ]);

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    feeReminders: true,
    attendanceAlerts: true,
    examNotifications: true,
  });

  const handleSaveAcademic = () => {
    toast({ title: "Success", description: "Academic settings saved successfully" });
  };

  const handleSaveGrading = () => {
    toast({ title: "Success", description: "Grading settings saved successfully" });
  };

  const handleSaveNotifications = () => {
    toast({ title: "Success", description: "Notification settings saved successfully" });
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  return (
    <div className="space-y-6 max-w-[1000px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <span>Dashboard</span><span>/</span><span>Settings</span><span>/</span>
            <span className="text-foreground font-medium">System</span>
          </div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary" />
            System Settings
          </h1>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="institution" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 lg:w-auto">
          <TabsTrigger value="institution" className="gap-2">
            <School className="h-4 w-4" />
            <span className="hidden sm:inline">Institution</span>
          </TabsTrigger>
          <TabsTrigger value="branding" className="gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Branding</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Preferences</span>
          </TabsTrigger>
          <TabsTrigger value="academic" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Academic</span>
          </TabsTrigger>
          <TabsTrigger value="grading" className="gap-2">
            <Award className="h-4 w-4" />
            <span className="hidden sm:inline">Grading</span>
          </TabsTrigger>
          <TabsTrigger value="roles" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Roles</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
        </TabsList>

        {/* Institution Tab */}
        <TabsContent value="institution">
          <InstitutionSettingsForm />
        </TabsContent>

        {/* Branding Tab */}
        <TabsContent value="branding">
          <BrandingSettingsPanel />
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <PlatformPreferencesPanel />
        </TabsContent>

        {/* Academic Tab */}
        <TabsContent value="academic">
          <SimpleCard title="Academic Settings" description="Configure academic year and calendar">
            <div className="grid gap-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="grid gap-2">
                  <Label>Current Session</Label>
                  <Select value={academicSettings.currentSession} onValueChange={(v) => setAcademicSettings({ ...academicSettings, currentSession: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2023-24">2023-24</SelectItem>
                      <SelectItem value="2024-25">2024-25</SelectItem>
                      <SelectItem value="2025-26">2025-26</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Session Start Month</Label>
                  <Select value={academicSettings.startMonth} onValueChange={(v) => setAcademicSettings({ ...academicSettings, startMonth: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {months.map((month) => <SelectItem key={month} value={month}>{month}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Session End Month</Label>
                  <Select value={academicSettings.endMonth} onValueChange={(v) => setAcademicSettings({ ...academicSettings, endMonth: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {months.map((month) => <SelectItem key={month} value={month}>{month}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Working Days</Label>
                <div className="flex flex-wrap gap-2">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                    <Badge
                      key={day}
                      variant={academicSettings.workingDays.includes(day) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        setAcademicSettings({
                          ...academicSettings,
                          workingDays: academicSettings.workingDays.includes(day)
                            ? academicSettings.workingDays.filter((d) => d !== day)
                            : [...academicSettings.workingDays, day],
                        });
                      }}
                    >
                      {day}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveAcademic} className="gradient-primary border-0 text-primary-foreground rounded-xl">
                  <Save className="h-4 w-4 mr-2" />Save Changes
                </Button>
              </div>
            </div>
          </SimpleCard>
        </TabsContent>

        {/* Grading Tab */}
        <TabsContent value="grading">
          <SimpleCard title="Grading System" description="Configure grades and passing criteria">
            <div className="grid gap-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Grading System</Label>
                  <Select value={gradingSettings.system} onValueChange={(v: "percentage" | "grades" | "cgpa") => setGradingSettings({ ...gradingSettings, system: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage Based</SelectItem>
                      <SelectItem value="grades">Grade Based</SelectItem>
                      <SelectItem value="cgpa">CGPA Based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Passing Score (%)</Label>
                  <Input type="number" value={gradingSettings.passingScore} onChange={(e) => setGradingSettings({ ...gradingSettings, passingScore: parseInt(e.target.value) || 0 })} min={0} max={100} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Grade Distribution</Label>
                <div className="rounded-lg border overflow-hidden">
                  <div className="grid grid-cols-4 gap-4 p-3 bg-muted/50 font-medium text-sm">
                    <span>Grade</span><span>Min Score</span><span>Max Score</span><span>Status</span>
                  </div>
                  {gradingSettings.grades.map((grade, index) => (
                    <motion.div key={grade.grade} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }} className="grid grid-cols-4 gap-4 p-3 border-t items-center">
                      <span className="font-semibold">{grade.grade}</span>
                      <span>{grade.minScore}%</span>
                      <span>{grade.maxScore}%</span>
                      <Badge className={grade.minScore >= gradingSettings.passingScore ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}>
                        {grade.minScore >= gradingSettings.passingScore ? "Pass" : "Fail"}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveGrading} className="gradient-primary border-0 text-primary-foreground rounded-xl">
                  <Save className="h-4 w-4 mr-2" />Save Changes
                </Button>
              </div>
            </div>
          </SimpleCard>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles">
          <SimpleCard title="Role Permissions" description="Manage user roles and access">
            <div className="space-y-4">
              {roles.map((role, index) => (
                <motion.div key={role.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="p-4 rounded-xl border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{role.name}</h3>
                        <p className="text-sm text-muted-foreground">{role.permissions.length} permissions</p>
                      </div>
                    </div>
                    {role.name !== "Super Admin" && <Button variant="outline" size="sm">Edit</Button>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.map((perm) => (
                      <Badge key={perm} variant="secondary" className="text-xs">{perm.replace(/_/g, " ")}</Badge>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </SimpleCard>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <SimpleCard title="Notification Settings" description="Configure alerts and notifications">
            <div className="space-y-6">
              <div className="space-y-4">
                {[
                  { key: "emailNotifications", icon: Mail, label: "Email Notifications", desc: "Send notifications via email", color: "primary" },
                  { key: "smsNotifications", icon: MessageSquare, label: "SMS Notifications", desc: "Send SMS to parents and staff", color: "success" },
                  { key: "feeReminders", icon: CreditCard, label: "Fee Reminders", desc: "Automatic reminders for pending fees", color: "warning" },
                  { key: "attendanceAlerts", icon: Users, label: "Attendance Alerts", desc: "Notify parents about absence", color: "accent" },
                  { key: "examNotifications", icon: FileText, label: "Exam Notifications", desc: "Exam schedule and result alerts", color: "destructive" },
                ].map(({ key, icon: Icon, label, desc, color }) => (
                  <div key={key} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-lg bg-${color}/10 flex items-center justify-center`}>
                        <Icon className={`h-5 w-5 text-${color}`} />
                      </div>
                      <div>
                        <p className="font-medium">{label}</p>
                        <p className="text-sm text-muted-foreground">{desc}</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications[key as keyof typeof notifications]}
                      onCheckedChange={(c) => setNotifications({ ...notifications, [key]: c })}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveNotifications} className="gradient-primary border-0 text-primary-foreground rounded-xl">
                  <Save className="h-4 w-4 mr-2" />Save Changes
                </Button>
              </div>
            </div>
          </SimpleCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
