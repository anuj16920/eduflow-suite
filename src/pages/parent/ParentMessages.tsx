import { useState } from "react";
import { MessageSquare, Send, Plus, Clock } from "lucide-react";
import { SimpleCard, StatsCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function ParentMessages() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<{ id: string; to: string; subject: string; message: string; timestamp: string }[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ to: "", subject: "", message: "" });

  const handleSend = () => {
    if (!form.to || !form.subject || !form.message) { toast({ title: "Error", description: "Fill all fields", variant: "destructive" }); return; }
    setMessages([{ id: `M${messages.length + 1}`, ...form, timestamp: new Date().toLocaleString() }, ...messages]);
    setForm({ to: "", subject: "", message: "" });
    setIsOpen(false);
    toast({ title: "Success", description: "Message sent" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Messages</h1><p className="text-muted-foreground">Communicate with teachers and admin</p></div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild><Button className="gradient-primary border-0"><Plus className="h-4 w-4 mr-2" />New Message</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Message</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2"><Label>To</Label>
                <Select value={form.to} onValueChange={v => setForm({ ...form, to: v })}>
                  <SelectTrigger><SelectValue placeholder="Select recipient" /></SelectTrigger>
                  <SelectContent><SelectItem value="class-teacher">Class Teacher</SelectItem><SelectItem value="admin">Admin</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="grid gap-2"><Label>Subject</Label><Input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} /></div>
              <div className="grid gap-2"><Label>Message</Label><Textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={4} /></div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button><Button onClick={handleSend}><Send className="h-4 w-4 mr-2" />Send</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Messages" value={messages.length} icon={MessageSquare} />
        <StatsCard title="Sent" value={messages.length} icon={Send} variant="primary" />
      </div>
      <SimpleCard title="Messages">
        {messages.length === 0 ? (
          <div className="text-center py-12"><MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" /><p className="text-muted-foreground">No messages yet</p></div>
        ) : (
          <div className="space-y-3">{messages.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-lg border">
              <div className="flex justify-between mb-2"><span className="font-medium">To: {m.to}</span><span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{m.timestamp}</span></div>
              <p className="font-medium text-sm">{m.subject}</p><p className="text-sm text-muted-foreground line-clamp-2">{m.message}</p>
            </motion.div>
          ))}</div>
        )}
      </SimpleCard>
    </div>
  );
}
