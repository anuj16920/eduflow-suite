import { useState } from "react";
import { SimpleCard, StatsCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, MoreHorizontal, Mail, Phone, Edit, Trash2, Users, UserCheck, Clock } from "lucide-react";

const teachers = [
  { id: 1, name: "Dr. Rajesh Kumar", email: "rajesh.kumar@school.edu", phone: "+91 98765 43210", subject: "Mathematics", classes: ["10-A", "10-B", "11-A"], status: "active", joinDate: "2020-06-15" },
  { id: 2, name: "Mrs. Priya Sharma", email: "priya.sharma@school.edu", phone: "+91 98765 43211", subject: "English", classes: ["9-A", "9-B", "10-A"], status: "active", joinDate: "2019-03-20" },
  { id: 3, name: "Mr. Anil Verma", email: "anil.verma@school.edu", phone: "+91 98765 43212", subject: "Physics", classes: ["11-A", "11-B", "12-A"], status: "active", joinDate: "2021-07-10" },
  { id: 4, name: "Mrs. Sunita Patel", email: "sunita.patel@school.edu", phone: "+91 98765 43213", subject: "Chemistry", classes: ["11-A", "12-A", "12-B"], status: "on-leave", joinDate: "2018-01-05" },
  { id: 5, name: "Mr. Vikram Singh", email: "vikram.singh@school.edu", phone: "+91 98765 43214", subject: "Biology", classes: ["9-A", "10-A", "11-A"], status: "active", joinDate: "2022-08-01" },
];

export default function TeachersManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredTeachers = teachers.filter((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.email.toLowerCase().includes(searchQuery.toLowerCase()) || t.subject.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div><h1 className="text-3xl font-bold">Teachers Management</h1><p className="text-muted-foreground">Manage your school's teaching staff</p></div>
        <Button className="gradient-primary border-0 text-primary-foreground rounded-xl"><Plus className="h-4 w-4 mr-2" />Add Teacher</Button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <StatsCard title="Total Teachers" value={156} icon={Users} />
        <StatsCard title="Active" value={148} icon={UserCheck} variant="success" />
        <StatsCard title="On Leave" value={8} icon={Clock} variant="warning" />
      </div>

      <SimpleCard>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search teachers..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" /></div>
          <div className="flex items-center gap-2"><Button variant="ghost" size="sm">Export</Button><Button variant="ghost" size="sm">Filter</Button></div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow className="border-border/30"><TableHead>Teacher</TableHead><TableHead>Subject</TableHead><TableHead>Classes</TableHead><TableHead>Status</TableHead><TableHead>Join Date</TableHead><TableHead className="w-10"></TableHead></TableRow></TableHeader>
            <TableBody>
              {filteredTeachers.map((teacher) => (
                <TableRow key={teacher.id} className="border-border/20 hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center"><span className="text-sm font-bold text-primary">{teacher.name.split(" ").map((n) => n[0]).join("")}</span></div>
                      <div><p className="font-medium">{teacher.name}</p><div className="flex items-center gap-1 text-xs text-muted-foreground"><Mail className="h-3 w-3" />{teacher.email}</div></div>
                    </div>
                  </TableCell>
                  <TableCell>{teacher.subject}</TableCell>
                  <TableCell><div className="flex flex-wrap gap-1">{teacher.classes.map((cls) => <Badge key={cls} variant="secondary" className="text-xs">{cls}</Badge>)}</div></TableCell>
                  <TableCell><Badge className={teacher.status === "active" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}>{teacher.status === "active" ? "Active" : "On Leave"}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{new Date(teacher.joinDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</TableCell>
                  <TableCell>
                    <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end"><DropdownMenuItem><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem><DropdownMenuItem><Phone className="h-4 w-4 mr-2" />Contact</DropdownMenuItem><DropdownMenuItem className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />Deactivate</DropdownMenuItem></DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SimpleCard>
    </div>
  );
}
