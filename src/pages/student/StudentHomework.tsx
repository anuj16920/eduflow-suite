import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Upload } from "lucide-react";
import { motion } from "framer-motion";

const homework = [
  { id: 1, subject: "Mathematics", title: "Chapter 5 - Integration Problems", dueDate: "Mar 10, 2026", status: "pending", teacher: "Dr. Kumar" },
  { id: 2, subject: "Physics", title: "Newton's Laws Worksheet", dueDate: "Mar 9, 2026", status: "submitted", teacher: "Mrs. Sharma" },
  { id: 3, subject: "English", title: "Essay - Climate Change", dueDate: "Mar 12, 2026", status: "pending", teacher: "Mr. Singh" },
  { id: 4, subject: "Chemistry", title: "Lab Report - Titration", dueDate: "Mar 8, 2026", status: "graded", grade: "A", teacher: "Dr. Patel" },
];

const statusColors: Record<string, string> = {
  pending: "destructive",
  submitted: "secondary",
  graded: "default",
};

export default function StudentHomework() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Homework</h1>
        <p className="text-muted-foreground">View and submit your assignments</p>
      </div>

      <div className="grid gap-4">
        {homework.map((hw, i) => (
          <motion.div key={hw.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{hw.title}</p>
                      <p className="text-sm text-muted-foreground">{hw.subject} · {hw.teacher}</p>
                      <p className="text-xs text-muted-foreground mt-1">Due: {hw.dueDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {hw.grade && <Badge variant="outline">Grade: {hw.grade}</Badge>}
                    <Badge variant={statusColors[hw.status] as any}>{hw.status}</Badge>
                    {hw.status === "pending" && (
                      <Button size="sm" variant="outline" className="gap-1">
                        <Upload className="h-3 w-3" /> Submit
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
