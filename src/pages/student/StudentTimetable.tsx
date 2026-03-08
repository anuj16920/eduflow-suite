import { SimpleCard } from "@/components/dashboard/StatsCard";
import { Badge } from "@/components/ui/badge";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const timetable: Record<string, { subject: string; time: string; teacher: string; room: string }[]> = {
  Monday: [{ subject: "Mathematics", time: "9:00 AM", teacher: "Dr. Kumar", room: "201" }, { subject: "English", time: "10:00 AM", teacher: "Mrs. Sharma", room: "105" }, { subject: "Physics", time: "11:00 AM", teacher: "Mr. Singh", room: "Lab 3" }],
  Tuesday: [{ subject: "Chemistry", time: "9:00 AM", teacher: "Mrs. Patel", room: "Lab 2" }, { subject: "Biology", time: "10:00 AM", teacher: "Mr. Verma", room: "Lab 1" }, { subject: "Mathematics", time: "11:00 AM", teacher: "Dr. Kumar", room: "201" }],
  Wednesday: [{ subject: "English", time: "9:00 AM", teacher: "Mrs. Sharma", room: "105" }, { subject: "Physics", time: "10:00 AM", teacher: "Mr. Singh", room: "Lab 3" }, { subject: "History", time: "11:00 AM", teacher: "Mrs. Gupta", room: "108" }],
  Thursday: [{ subject: "Mathematics", time: "9:00 AM", teacher: "Dr. Kumar", room: "201" }, { subject: "Chemistry", time: "10:00 AM", teacher: "Mrs. Patel", room: "Lab 2" }, { subject: "English", time: "11:00 AM", teacher: "Mrs. Sharma", room: "105" }],
  Friday: [{ subject: "Biology", time: "9:00 AM", teacher: "Mr. Verma", room: "Lab 1" }, { subject: "Mathematics", time: "10:00 AM", teacher: "Dr. Kumar", room: "201" }, { subject: "Physics", time: "11:00 AM", teacher: "Mr. Singh", room: "Lab 3" }],
  Saturday: [{ subject: "Sports", time: "9:00 AM", teacher: "Mr. Rao", room: "Ground" }, { subject: "Art", time: "10:00 AM", teacher: "Mrs. Khan", room: "Art Room" }],
};

export default function StudentTimetable() {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  return (
    <div className="space-y-8">
      <div><h1 className="text-3xl font-bold">Timetable</h1><p className="text-muted-foreground">Your weekly class schedule</p></div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{days.map((day) => (
        <SimpleCard key={day} title={day} action={day === today ? <Badge className="bg-primary/10 text-primary">Today</Badge> : undefined}>
          <div className="space-y-2">{timetable[day]?.map((slot, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/30"><div><p className="font-medium text-sm">{slot.subject}</p><p className="text-xs text-muted-foreground">{slot.teacher} • {slot.room}</p></div><span className="text-xs text-muted-foreground font-medium">{slot.time}</span></div>
          ))}</div>
        </SimpleCard>
      ))}</div>
    </div>
  );
}
