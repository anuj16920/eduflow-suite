import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const timetable: Record<string, { subject: string; time: string; teacher: string; room: string }[]> = {
  Monday: [
    { subject: "Mathematics", time: "9:00-10:00", teacher: "Dr. Kumar", room: "201" },
    { subject: "Physics", time: "10:30-11:30", teacher: "Mrs. Sharma", room: "Lab 3" },
    { subject: "English", time: "12:00-1:00", teacher: "Mr. Singh", room: "105" },
  ],
  Tuesday: [
    { subject: "Chemistry", time: "9:00-10:00", teacher: "Dr. Patel", room: "Lab 2" },
    { subject: "History", time: "10:30-11:30", teacher: "Ms. Rao", room: "203" },
    { subject: "Mathematics", time: "12:00-1:00", teacher: "Dr. Kumar", room: "201" },
  ],
  Wednesday: [
    { subject: "English", time: "9:00-10:00", teacher: "Mr. Singh", room: "105" },
    { subject: "Physics Lab", time: "10:30-12:00", teacher: "Mrs. Sharma", room: "Lab 3" },
    { subject: "Computer Science", time: "12:30-1:30", teacher: "Mr. Verma", room: "CS Lab" },
  ],
  Thursday: [
    { subject: "Mathematics", time: "9:00-10:00", teacher: "Dr. Kumar", room: "201" },
    { subject: "Chemistry Lab", time: "10:30-12:00", teacher: "Dr. Patel", room: "Lab 2" },
    { subject: "Hindi", time: "12:30-1:30", teacher: "Mrs. Gupta", room: "104" },
  ],
  Friday: [
    { subject: "Physics", time: "9:00-10:00", teacher: "Mrs. Sharma", room: "Lab 3" },
    { subject: "English", time: "10:30-11:30", teacher: "Mr. Singh", room: "105" },
    { subject: "Sports", time: "12:00-1:30", teacher: "Coach Ravi", room: "Ground" },
  ],
};

export default function StudentTimetable() {
  const today = days[new Date().getDay() - 1] || "Monday";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Timetable</h1>
        <p className="text-muted-foreground">Your weekly class schedule</p>
      </div>

      <div className="grid gap-4">
        {days.map((day) => (
          <Card key={day} className={day === today ? "border-primary" : ""}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-4 w-4 text-primary" />
                {day}
                {day === today && <Badge>Today</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {timetable[day]?.map((slot, i) => (
                  <div key={i} className="p-3 rounded-lg bg-muted/50 border">
                    <p className="font-medium">{slot.subject}</p>
                    <p className="text-sm text-muted-foreground">{slot.time}</p>
                    <p className="text-xs text-muted-foreground">{slot.teacher} · Room {slot.room}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
