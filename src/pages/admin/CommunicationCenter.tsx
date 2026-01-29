import { useState } from "react";
import {
  Send,
  Users,
  Bell,
  MessageSquare,
  Search,
  Plus,
  Trash2,
  Mail,
  Clock,
  CheckCircle,
  Filter,
} from "lucide-react";
import { SimpleCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface Announcement {
  id: string;
  title: string;
  message: string;
  target: string[];
  priority: "low" | "medium" | "high";
  status: "draft" | "sent";
  createdAt: string;
  sentAt?: string;
}

interface Message {
  id: string;
  from: string;
  fromRole: string;
  subject: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export default function CommunicationCenter() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const [composeForm, setComposeForm] = useState({
    title: "",
    message: "",
    priority: "medium" as "low" | "medium" | "high",
    targetParents: true,
    targetTeachers: false,
    targetStudents: false,
  });

  const filteredAnnouncements = announcements.filter(
    (a) =>
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendAnnouncement = () => {
    if (!composeForm.title || !composeForm.message) {
      toast({
        title: "Error",
        description: "Please fill in title and message",
        variant: "destructive",
      });
      return;
    }

    const targets: string[] = [];
    if (composeForm.targetParents) targets.push("Parents");
    if (composeForm.targetTeachers) targets.push("Teachers");
    if (composeForm.targetStudents) targets.push("Students");

    if (targets.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one target audience",
        variant: "destructive",
      });
      return;
    }

    const newAnnouncement: Announcement = {
      id: `A${announcements.length + 1}`,
      title: composeForm.title,
      message: composeForm.message,
      target: targets,
      priority: composeForm.priority,
      status: "sent",
      createdAt: new Date().toLocaleString(),
      sentAt: new Date().toLocaleString(),
    };

    setAnnouncements([newAnnouncement, ...announcements]);
    setComposeForm({
      title: "",
      message: "",
      priority: "medium",
      targetParents: true,
      targetTeachers: false,
      targetStudents: false,
    });
    setIsComposeOpen(false);
    toast({
      title: "Success",
      description: "Announcement sent successfully",
    });
  };

  const handleSaveDraft = () => {
    if (!composeForm.title) {
      toast({
        title: "Error",
        description: "Please provide a title",
        variant: "destructive",
      });
      return;
    }

    const targets: string[] = [];
    if (composeForm.targetParents) targets.push("Parents");
    if (composeForm.targetTeachers) targets.push("Teachers");
    if (composeForm.targetStudents) targets.push("Students");

    const newAnnouncement: Announcement = {
      id: `A${announcements.length + 1}`,
      title: composeForm.title,
      message: composeForm.message,
      target: targets,
      priority: composeForm.priority,
      status: "draft",
      createdAt: new Date().toLocaleString(),
    };

    setAnnouncements([newAnnouncement, ...announcements]);
    setComposeForm({
      title: "",
      message: "",
      priority: "medium",
      targetParents: true,
      targetTeachers: false,
      targetStudents: false,
    });
    setIsComposeOpen(false);
    toast({
      title: "Success",
      description: "Draft saved successfully",
    });
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
    toast({
      title: "Success",
      description: "Announcement deleted",
    });
  };

  const handleMarkAsRead = (id: string) => {
    setMessages(messages.map((m) => (m.id === id ? { ...m, read: true } : m)));
  };

  const handleDeleteMessage = (id: string) => {
    setMessages(messages.filter((m) => m.id !== id));
    toast({
      title: "Success",
      description: "Message deleted",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive/10 text-destructive";
      case "medium":
        return "bg-warning/10 text-warning";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Communication Center</h1>
          <p className="text-muted-foreground">Send announcements and manage messages</p>
        </div>
        <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary border-0 text-primary-foreground hover:opacity-90">
              <Send className="h-4 w-4 mr-2" />
              New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Compose Announcement</DialogTitle>
              <DialogDescription>
                Send an announcement to parents, teachers, or students
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Title *</Label>
                <Input
                  value={composeForm.title}
                  onChange={(e) => setComposeForm({ ...composeForm, title: e.target.value })}
                  placeholder="Announcement title"
                />
              </div>
              <div className="grid gap-2">
                <Label>Message *</Label>
                <Textarea
                  value={composeForm.message}
                  onChange={(e) => setComposeForm({ ...composeForm, message: e.target.value })}
                  placeholder="Type your message here..."
                  rows={5}
                />
              </div>
              <div className="grid gap-2">
                <Label>Priority</Label>
                <Select
                  value={composeForm.priority}
                  onValueChange={(v: "low" | "medium" | "high") =>
                    setComposeForm({ ...composeForm, priority: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High (Urgent)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Target Audience</Label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={composeForm.targetParents}
                      onCheckedChange={(c) =>
                        setComposeForm({ ...composeForm, targetParents: !!c })
                      }
                    />
                    <span className="text-sm">Parents</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={composeForm.targetTeachers}
                      onCheckedChange={(c) =>
                        setComposeForm({ ...composeForm, targetTeachers: !!c })
                      }
                    />
                    <span className="text-sm">Teachers</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={composeForm.targetStudents}
                      onCheckedChange={(c) =>
                        setComposeForm({ ...composeForm, targetStudents: !!c })
                      }
                    />
                    <span className="text-sm">Students</span>
                  </label>
                </div>
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={handleSaveDraft}>
                Save Draft
              </Button>
              <Button onClick={handleSendAnnouncement} className="gradient-primary border-0">
                <Send className="h-4 w-4 mr-2" />
                Send Now
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{announcements.filter((a) => a.status === "sent").length}</p>
              <p className="text-sm text-muted-foreground">Sent</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-xl bg-gradient-to-br from-warning/10 to-warning/5 border"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{announcements.filter((a) => a.status === "draft").length}</p>
              <p className="text-sm text-muted-foreground">Drafts</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-xl bg-gradient-to-br from-success/10 to-success/5 border"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <MessageSquare className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{messages.length}</p>
              <p className="text-sm text-muted-foreground">Messages</p>
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
              <Mail className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{messages.filter((m) => !m.read).length}</p>
              <p className="text-sm text-muted-foreground">Unread</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="announcements" className="space-y-6">
        <TabsList>
          <TabsTrigger value="announcements">
            <Bell className="h-4 w-4 mr-2" />
            Announcements
          </TabsTrigger>
          <TabsTrigger value="messages">
            <MessageSquare className="h-4 w-4 mr-2" />
            Messages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="announcements">
          <SimpleCard>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search announcements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              {filteredAnnouncements.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No announcements yet</p>
                  <p className="text-sm text-muted-foreground">
                    Click "New Announcement" to create one
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAnnouncements.map((announcement, index) => (
                    <motion.div
                      key={announcement.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 rounded-xl border hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{announcement.title}</h3>
                            <Badge className={getPriorityColor(announcement.priority)}>
                              {announcement.priority}
                            </Badge>
                            <Badge
                              variant={announcement.status === "sent" ? "default" : "secondary"}
                            >
                              {announcement.status === "sent" ? (
                                <>
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Sent
                                </>
                              ) : (
                                "Draft"
                              )}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {announcement.message}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {announcement.target.join(", ")}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {announcement.sentAt || announcement.createdAt}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDeleteAnnouncement(announcement.id)}
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

        <TabsContent value="messages">
          <SimpleCard>
            <AnimatePresence mode="popLayout">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No messages yet</p>
                  <p className="text-sm text-muted-foreground">
                    Messages from parents and teachers will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 rounded-xl border transition-colors cursor-pointer ${
                        !message.read ? "bg-primary/5 border-primary/20" : "hover:bg-muted/50"
                      }`}
                      onClick={() => handleMarkAsRead(message.id)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{message.from}</span>
                            <Badge variant="secondary" className="text-xs">
                              {message.fromRole}
                            </Badge>
                            {!message.read && (
                              <span className="h-2 w-2 rounded-full bg-primary" />
                            )}
                          </div>
                          <p className="font-medium text-sm">{message.subject}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {message.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {message.timestamp}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMessage(message.id);
                          }}
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
