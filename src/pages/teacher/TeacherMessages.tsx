import { useState } from "react";
import {
  MessageSquare,
  Send,
  Search,
  Plus,
  Trash2,
  Clock,
  User,
  Mail,
  ChevronRight,
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

interface Message {
  id: string;
  from: string;
  fromRole: "parent" | "admin" | "teacher";
  subject: string;
  message: string;
  timestamp: string;
  read: boolean;
  replies: { from: string; message: string; timestamp: string }[];
}

export default function TeacherMessages() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [replyText, setReplyText] = useState("");

  const [composeForm, setComposeForm] = useState({
    to: "",
    subject: "",
    message: "",
  });

  const filteredMessages = messages.filter(
    (m) =>
      m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unreadCount = messages.filter((m) => !m.read).length;

  const handleSendMessage = () => {
    if (!composeForm.to || !composeForm.subject || !composeForm.message) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const newMessage: Message = {
      id: `M${messages.length + 1}`,
      from: "You",
      fromRole: "teacher",
      subject: composeForm.subject,
      message: composeForm.message,
      timestamp: new Date().toLocaleString(),
      read: true,
      replies: [],
    };

    setMessages([newMessage, ...messages]);
    setComposeForm({ to: "", subject: "", message: "" });
    setIsComposeOpen(false);
    toast({
      title: "Success",
      description: "Message sent successfully",
    });
  };

  const handleMarkAsRead = (id: string) => {
    setMessages(messages.map((m) => (m.id === id ? { ...m, read: true } : m)));
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedMessage) return;

    setMessages(
      messages.map((m) =>
        m.id === selectedMessage.id
          ? {
              ...m,
              replies: [
                ...m.replies,
                {
                  from: "You",
                  message: replyText,
                  timestamp: new Date().toLocaleString(),
                },
              ],
            }
          : m
      )
    );
    setReplyText("");
    toast({
      title: "Success",
      description: "Reply sent",
    });
  };

  const handleDeleteMessage = (id: string) => {
    setMessages(messages.filter((m) => m.id !== id));
    setSelectedMessage(null);
    toast({
      title: "Success",
      description: "Message deleted",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-muted-foreground">Communicate with parents and administrators</p>
        </div>
        <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary border-0 text-primary-foreground hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Compose
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>New Message</DialogTitle>
              <DialogDescription>Send a message to parents or administrators</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>To</Label>
                <Select
                  value={composeForm.to}
                  onValueChange={(v) => setComposeForm({ ...composeForm, to: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select recipient" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="all-parents">All Parents (My Classes)</SelectItem>
                    <SelectItem value="specific-parent">Specific Parent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Subject</Label>
                <Input
                  value={composeForm.subject}
                  onChange={(e) => setComposeForm({ ...composeForm, subject: e.target.value })}
                  placeholder="Message subject"
                />
              </div>
              <div className="grid gap-2">
                <Label>Message</Label>
                <Textarea
                  value={composeForm.message}
                  onChange={(e) => setComposeForm({ ...composeForm, message: e.target.value })}
                  placeholder="Type your message..."
                  rows={6}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsComposeOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendMessage} className="gradient-primary border-0">
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Messages" value={messages.length} icon={MessageSquare} />
        <StatsCard title="Unread" value={unreadCount} icon={Mail} variant="primary" />
        <StatsCard
          title="From Parents"
          value={messages.filter((m) => m.fromRole === "parent").length}
          icon={User}
        />
        <StatsCard
          title="From Admin"
          value={messages.filter((m) => m.fromRole === "admin").length}
          icon={User}
          variant="warning"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Message List */}
        <div className="lg:col-span-1">
          <SimpleCard>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <AnimatePresence mode="popLayout">
              {filteredMessages.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No messages</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {filteredMessages.map((msg, index) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedMessage?.id === msg.id
                          ? "border-primary bg-primary/5"
                          : !msg.read
                          ? "bg-primary/5"
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() => {
                        setSelectedMessage(msg);
                        handleMarkAsRead(msg.id);
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm truncate">{msg.from}</span>
                        {!msg.read && (
                          <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                        )}
                      </div>
                      <p className="font-medium text-sm truncate">{msg.subject}</p>
                      <p className="text-xs text-muted-foreground truncate">{msg.message}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{msg.timestamp}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </SimpleCard>
        </div>

        {/* Message View */}
        <div className="lg:col-span-2">
          <SimpleCard>
            {selectedMessage ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{selectedMessage.subject}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={selectedMessage.fromRole === "parent" ? "secondary" : "default"}
                      >
                        {selectedMessage.fromRole}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        From: {selectedMessage.from}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => handleDeleteMessage(selectedMessage.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground">
                  {selectedMessage.timestamp}
                </div>
                <div className="p-4 rounded-lg bg-muted/50 whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>

                {/* Replies */}
                {selectedMessage.replies.length > 0 && (
                  <div className="space-y-3 pt-4 border-t">
                    <h4 className="font-medium text-sm">Replies</h4>
                    {selectedMessage.replies.map((reply, i) => (
                      <div key={i} className="p-3 rounded-lg bg-muted/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{reply.from}</span>
                          <span className="text-xs text-muted-foreground">{reply.timestamp}</span>
                        </div>
                        <p className="text-sm">{reply.message}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Box */}
                <div className="pt-4 border-t space-y-3">
                  <Textarea
                    placeholder="Type your reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleSendReply} disabled={!replyText.trim()}>
                      <Send className="h-4 w-4 mr-2" />
                      Send Reply
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">Select a message to view</p>
              </div>
            )}
          </SimpleCard>
        </div>
      </div>
    </div>
  );
}
