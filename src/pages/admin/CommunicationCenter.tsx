import { useState } from "react";
import { Send, Users, Bell, MessageSquare, Search, Plus, Trash2, Mail, Clock, CheckCircle } from "lucide-react";
import { SimpleCard, StatsCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface Announcement { id: string; title: string; message: string; target: string[]; priority: "low" | "medium" | "high"; status: "draft" | "sent"; createdAt: string; sentAt?: string; }
interface Message { id: string; from: string; fromRole: string; subject: string; message: string; timestamp: string; read: boolean; }

export default function CommunicationCenter() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const [composeForm, setComposeForm] = useState({ title: "", message: "", priority: "medium" as const, targetParents: true, targetTeachers: false, targetStudents: false });

  const filteredAnnouncements = announcements.filter((a) => a.title.toLowerCase().includes(searchTerm.toLowerCase()) || a.message.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSendAnnouncement = () => {
    if (!composeForm.title || !composeForm.message) { toast({ title: "Error", description: "Please fill in title and message", variant: "destructive" }); return; }
    const targets: string[] = [];
    if (composeForm.targetParents) targets.push("Parents");
    if (composeForm.targetTeachers) targets.push("Teachers");
    if (composeForm.targetStudents) targets.push("Students");
    if (targets.length === 0) { toast({ title: "Error", description: "Select at least one audience", variant: "destructive" }); return; }
    setAnnouncements([{ id: `A${announcements.length + 1}`, title: composeForm.title, message: composeForm.message, target: targets, priority: composeForm.priority, status: "sent", createdAt: new Date().toLocaleString(), sentAt: new Date().toLocaleString() }, ...announcements]);
    setComposeForm({ title: "", message: "", priority: "medium", targetParents: true, targetTeachers: false, targetStudents: false });
    setIsComposeOpen(false);
    toast({ title: "Success", description: "Announcement sent" });
  };

  const handleSaveDraft = () => {
    if (!composeForm.title) { toast({ title: "Error", description: "Please provide a title", variant: "destructive" }); return; }
    const targets: string[] = [];
    if (composeForm.targetParents) targets.push("Parents");
    if (composeForm.targetTeachers) targets.push("Teachers");
    if (composeForm.targetStudents) targets.push("Students");
    setAnnouncements([{ id: `A${announcements.length + 1}`, title: composeForm.title, message: composeForm.message, target: targets, priority: composeForm.priority, status: "draft", createdAt: new Date().toLocaleString() }, ...announcements]);
    setComposeForm({ title: "", message: "", priority: "medium", targetParents: true, targetTeachers: false, targetStudents: false });
    setIsComposeOpen(false);
    toast({ title: "Draft saved" });
  };

  const getPriorityColor = (p: string) => p === "high" ? "bg-red-500/10 text-red-500" : p === "medium" ? "bg-amber-500/10 text-amber-500" : "bg-muted text-muted-foreground";

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div><h1 className="text-3xl font-bold">Communication Center</h1><p className="text-muted-foreground">Send announcements and manage messages</p></div>
        <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
          <DialogTrigger asChild><Button className="gradient-primary border-0 text-primary-foreground rounded-xl"><Send className="h-4 w-4 mr-2" />New Announcement</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Compose Announcement</DialogTitle><DialogDescription>Send to parents, teachers, or students</DialogDescription></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2"><Label>Title *</Label><Input value={composeForm.title} onChange={(e) => setComposeForm({ ...composeForm, title: e.target.value })} placeholder="Announcement title" /></div>
              <div className="grid gap-2"><Label>Message *</Label><Textarea value={composeForm.message} onChange={(e) => setComposeForm({ ...composeForm, message: e.target.value })} placeholder="Type your message..." rows={5} /></div>
              <div className="grid gap-2"><Label>Priority</Label><Select value={composeForm.priority} onValueChange={(v: any) => setComposeForm({ ...composeForm, priority: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High (Urgent)</SelectItem></SelectContent></Select></div>
              <div className="grid gap-2"><Label>Target Audience</Label><div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer"><Checkbox checked={composeForm.targetParents} onCheckedChange={(c) => setComposeForm({ ...composeForm, targetParents: !!c })} /><span className="text-sm">Parents</span></label>
                <label className="flex items-center gap-2 cursor-pointer"><Checkbox checked={composeForm.targetTeachers} onCheckedChange={(c) => setComposeForm({ ...composeForm, targetTeachers: !!c })} /><span className="text-sm">Teachers</span></label>
                <label className="flex items-center gap-2 cursor-pointer"><Checkbox checked={composeForm.targetStudents} onCheckedChange={(c) => setComposeForm({ ...composeForm, targetStudents: !!c })} /><span className="text-sm">Students</span></label>
              </div></div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2"><Button variant="outline" onClick={handleSaveDraft}>Save Draft</Button><Button onClick={handleSendAnnouncement} className="gradient-primary border-0"><Send className="h-4 w-4 mr-2" />Send Now</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard title="Sent" value={announcements.filter((a) => a.status === "sent").length} icon={Bell} variant="primary" />
        <StatsCard title="Drafts" value={announcements.filter((a) => a.status === "draft").length} icon={Clock} variant="warning" />
        <StatsCard title="Messages" value={messages.length} icon={MessageSquare} variant="success" />
        <StatsCard title="Unread" value={messages.filter((m) => !m.read).length} icon={Mail} />
      </div>

      <Tabs defaultValue="announcements" className="space-y-6">
        <TabsList><TabsTrigger value="announcements"><Bell className="h-4 w-4 mr-2" />Announcements</TabsTrigger><TabsTrigger value="messages"><MessageSquare className="h-4 w-4 mr-2" />Messages</TabsTrigger></TabsList>

        <TabsContent value="announcements">
          <SimpleCard>
            <div className="mb-6 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search announcements..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 max-w-sm" /></div>
            <AnimatePresence mode="popLayout">
              {filteredAnnouncements.length === 0 ? (
                <div className="text-center py-12"><Bell className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" /><p className="text-muted-foreground">No announcements yet</p></div>
              ) : (
                <div className="space-y-3">
                  {filteredAnnouncements.map((a, index) => (
                    <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ delay: index * 0.05 }}
                      className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{a.title}</h3>
                            <Badge className={getPriorityColor(a.priority)}>{a.priority}</Badge>
                            <Badge variant={a.status === "sent" ? "default" : "secondary"}>{a.status === "sent" ? <><CheckCircle className="h-3 w-3 mr-1" />Sent</> : "Draft"}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{a.message}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Users className="h-3 w-3" />{a.target.join(", ")}</span>
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{a.sentAt || a.createdAt}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { setAnnouncements(announcements.filter((x) => x.id !== a.id)); toast({ title: "Deleted" }); }}><Trash2 className="h-4 w-4" /></Button>
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
            {messages.length === 0 ? (
              <div className="text-center py-12"><MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" /><p className="text-muted-foreground">No messages yet</p></div>
            ) : (
              <div className="space-y-3">
                {messages.map((m, i) => (
                  <motion.div key={m.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                    className={`p-4 rounded-xl transition-colors ${m.read ? "bg-muted/20" : "bg-muted/40"}`}>
                    <div className="flex items-start justify-between"><div><p className="font-semibold text-sm">{m.from}<Badge variant="secondary" className="ml-2 text-xs">{m.fromRole}</Badge></p><p className="text-sm mt-1">{m.subject}</p><p className="text-xs text-muted-foreground mt-1">{m.message}</p></div><span className="text-xs text-muted-foreground">{m.timestamp}</span></div>
                  </motion.div>
                ))}
              </div>
            )}
          </SimpleCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
