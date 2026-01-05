import { useState } from "react";
import { SimpleCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, MoreHorizontal, Eye, Edit, Trash2, Download } from "lucide-react";

const students = [
  {
    id: "STU001",
    name: "Aarav Sharma",
    class: "10-A",
    rollNo: 1,
    parentName: "Mr. Rakesh Sharma",
    phone: "+91 98765 43210",
    feeStatus: "paid",
    attendance: 95,
  },
  {
    id: "STU002",
    name: "Ananya Patel",
    class: "10-A",
    rollNo: 2,
    parentName: "Mrs. Sunita Patel",
    phone: "+91 98765 43211",
    feeStatus: "paid",
    attendance: 98,
  },
  {
    id: "STU003",
    name: "Arjun Verma",
    class: "10-A",
    rollNo: 3,
    parentName: "Mr. Anil Verma",
    phone: "+91 98765 43212",
    feeStatus: "pending",
    attendance: 88,
  },
  {
    id: "STU004",
    name: "Diya Singh",
    class: "10-B",
    rollNo: 1,
    parentName: "Mr. Vikram Singh",
    phone: "+91 98765 43213",
    feeStatus: "paid",
    attendance: 92,
  },
  {
    id: "STU005",
    name: "Ishaan Kumar",
    class: "10-B",
    rollNo: 2,
    parentName: "Dr. Rajesh Kumar",
    phone: "+91 98765 43214",
    feeStatus: "partial",
    attendance: 85,
  },
];

export default function StudentsManagement() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.class.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Students Management</h1>
          <p className="text-muted-foreground">Manage student records and information</p>
        </div>
        <Button className="gradient-primary border-0 text-primary-foreground hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-sm text-muted-foreground">Total Students</p>
          <p className="text-2xl font-bold">2,847</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-sm text-muted-foreground">Boys</p>
          <p className="text-2xl font-bold text-primary">1,523</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-sm text-muted-foreground">Girls</p>
          <p className="text-2xl font-bold text-accent">1,324</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-sm text-muted-foreground">New Admissions</p>
          <p className="text-2xl font-bold text-success">156</p>
        </div>
      </div>

      {/* Table */}
      <SimpleCard>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              Filter
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Fee Status</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-mono text-xs">{student.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">
                          {student.name.split(" ").map((n) => n[0]).join("")}
                        </span>
                      </div>
                      <span className="font-medium">{student.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{student.class}</Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{student.parentName}</p>
                      <p className="text-xs text-muted-foreground">{student.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        student.feeStatus === "paid"
                          ? "bg-success/10 text-success border-success/20"
                          : student.feeStatus === "pending"
                          ? "bg-destructive/10 text-destructive border-destructive/20"
                          : "bg-warning/10 text-warning border-warning/20"
                      }
                    >
                      {student.feeStatus.charAt(0).toUpperCase() + student.feeStatus.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            student.attendance >= 90
                              ? "bg-success"
                              : student.attendance >= 75
                              ? "bg-warning"
                              : "bg-destructive"
                          }`}
                          style={{ width: `${student.attendance}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">{student.attendance}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
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
