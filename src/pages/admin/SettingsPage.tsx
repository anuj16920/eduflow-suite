import { useState } from "react";
import {
  Settings,
  School,
  Calendar,
  Award,
  Shield,
  Palette,
  Upload,
  Save,
  Bell,
  Globe,
  Lock,
  Users,
  Mail,
  MessageSquare,
  CreditCard,
  FileText,
} from "lucide-react";
import { SimpleCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

interface SchoolProfile {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  principalName: string;
  establishedYear: string;
}

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

  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>({
    name: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    principalName: "",
    establishedYear: "",
  });

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

  const [roles, setRoles] = useState<Role[]>([
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

  const handleSaveProfile = () => {
    toast({
      title: "Success",
      description: "School profile saved successfully",
    });
  };

  const handleSaveAcademic = () => {
    toast({
      title: "Success",
      description: "Academic settings saved successfully",
    });
  };

  const handleSaveGrading = () => {
    toast({
      title: "Success",
      description: "Grading settings saved successfully",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Success",
      description: "Notification settings saved successfully",
    });
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage school settings and configurations</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 lg:w-auto">
          <TabsTrigger value="profile" className="gap-2">
            <School className="h-4 w-4" />
            <span className="hidden sm:inline">School Profile</span>
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

        {/* School Profile Tab */}
        <TabsContent value="profile">
          <SimpleCard title="School Profile" description="Basic information about your school">
            <div className="grid gap-6">
              {/* Logo Upload */}
              <div className="flex items-center gap-6">
                <div className="h-24 w-24 rounded-xl border-2 border-dashed flex items-center justify-center bg-muted/50">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Logo
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    PNG, JPG up to 2MB. Recommended: 200x200px
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>School Name</Label>
                  <Input
                    value={schoolProfile.name}
                    onChange={(e) => setSchoolProfile({ ...schoolProfile, name: e.target.value })}
                    placeholder="Enter school name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Principal Name</Label>
                  <Input
                    value={schoolProfile.principalName}
                    onChange={(e) => setSchoolProfile({ ...schoolProfile, principalName: e.target.value })}
                    placeholder="Enter principal name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={schoolProfile.email}
                    onChange={(e) => setSchoolProfile({ ...schoolProfile, email: e.target.value })}
                    placeholder="school@email.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Phone</Label>
                  <Input
                    value={schoolProfile.phone}
                    onChange={(e) => setSchoolProfile({ ...schoolProfile, phone: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Website</Label>
                  <Input
                    value={schoolProfile.website}
                    onChange={(e) => setSchoolProfile({ ...schoolProfile, website: e.target.value })}
                    placeholder="https://www.school.edu"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Established Year</Label>
                  <Input
                    value={schoolProfile.establishedYear}
                    onChange={(e) => setSchoolProfile({ ...schoolProfile, establishedYear: e.target.value })}
                    placeholder="e.g., 1990"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Address</Label>
                <Textarea
                  value={schoolProfile.address}
                  onChange={(e) => setSchoolProfile({ ...schoolProfile, address: e.target.value })}
                  placeholder="Enter complete address"
                  rows={3}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} className="gradient-primary border-0">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </SimpleCard>
        </TabsContent>

        {/* Academic Tab */}
        <TabsContent value="academic">
          <SimpleCard title="Academic Settings" description="Configure academic year and calendar">
            <div className="grid gap-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="grid gap-2">
                  <Label>Current Session</Label>
                  <Select
                    value={academicSettings.currentSession}
                    onValueChange={(v) => setAcademicSettings({ ...academicSettings, currentSession: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2023-24">2023-24</SelectItem>
                      <SelectItem value="2024-25">2024-25</SelectItem>
                      <SelectItem value="2025-26">2025-26</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Session Start Month</Label>
                  <Select
                    value={academicSettings.startMonth}
                    onValueChange={(v) => setAcademicSettings({ ...academicSettings, startMonth: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month} value={month}>{month}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Session End Month</Label>
                  <Select
                    value={academicSettings.endMonth}
                    onValueChange={(v) => setAcademicSettings({ ...academicSettings, endMonth: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month} value={month}>{month}</SelectItem>
                      ))}
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
                        if (academicSettings.workingDays.includes(day)) {
                          setAcademicSettings({
                            ...academicSettings,
                            workingDays: academicSettings.workingDays.filter((d) => d !== day),
                          });
                        } else {
                          setAcademicSettings({
                            ...academicSettings,
                            workingDays: [...academicSettings.workingDays, day],
                          });
                        }
                      }}
                    >
                      {day}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveAcademic} className="gradient-primary border-0">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
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
                  <Select
                    value={gradingSettings.system}
                    onValueChange={(v: "percentage" | "grades" | "cgpa") =>
                      setGradingSettings({ ...gradingSettings, system: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage Based</SelectItem>
                      <SelectItem value="grades">Grade Based</SelectItem>
                      <SelectItem value="cgpa">CGPA Based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Passing Score (%)</Label>
                  <Input
                    type="number"
                    value={gradingSettings.passingScore}
                    onChange={(e) =>
                      setGradingSettings({ ...gradingSettings, passingScore: parseInt(e.target.value) || 0 })
                    }
                    min={0}
                    max={100}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Grade Distribution</Label>
                <div className="rounded-lg border overflow-hidden">
                  <div className="grid grid-cols-4 gap-4 p-3 bg-muted/50 font-medium text-sm">
                    <span>Grade</span>
                    <span>Min Score</span>
                    <span>Max Score</span>
                    <span>Status</span>
                  </div>
                  {gradingSettings.grades.map((grade, index) => (
                    <motion.div
                      key={grade.grade}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="grid grid-cols-4 gap-4 p-3 border-t items-center"
                    >
                      <span className="font-semibold">{grade.grade}</span>
                      <span>{grade.minScore}%</span>
                      <span>{grade.maxScore}%</span>
                      <Badge
                        className={
                          grade.minScore >= gradingSettings.passingScore
                            ? "bg-success/10 text-success"
                            : "bg-destructive/10 text-destructive"
                        }
                      >
                        {grade.minScore >= gradingSettings.passingScore ? "Pass" : "Fail"}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveGrading} className="gradient-primary border-0">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
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
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl border"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{role.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {role.permissions.length} permissions
                        </p>
                      </div>
                    </div>
                    {role.name !== "Super Admin" && (
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.map((perm) => (
                      <Badge key={perm} variant="secondary" className="text-xs">
                        {perm.replace(/_/g, " ")}
                      </Badge>
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
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Send notifications via email
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(c) =>
                      setNotifications({ ...notifications, emailNotifications: c })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Send SMS to parents and staff
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.smsNotifications}
                    onCheckedChange={(c) =>
                      setNotifications({ ...notifications, smsNotifications: c })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <p className="font-medium">Fee Reminders</p>
                      <p className="text-sm text-muted-foreground">
                        Automatic reminders for pending fees
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.feeReminders}
                    onCheckedChange={(c) =>
                      setNotifications({ ...notifications, feeReminders: c })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Attendance Alerts</p>
                      <p className="text-sm text-muted-foreground">
                        Notify parents about absence
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.attendanceAlerts}
                    onCheckedChange={(c) =>
                      setNotifications({ ...notifications, attendanceAlerts: c })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                      <p className="font-medium">Exam Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Exam schedule and result alerts
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.examNotifications}
                    onCheckedChange={(c) =>
                      setNotifications({ ...notifications, examNotifications: c })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveNotifications} className="gradient-primary border-0">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </SimpleCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
