import { useState } from "react";
import { BookOpen, Clock, Users, Calendar, Plus, ChevronRight } from "lucide-react";
import { SimpleCard, StatsCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

interface ClassInfo {
  id: string;
  name: string;
  subject: string;
  students: number;
  schedule: { day: string; time: string; room: string }[];
}

export default function TeacherClasses() {
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [selectedDay, setSelectedDay] = useState("all");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const todaySchedule = classes.flatMap((cls) =>
    cls.schedule.map((s) => ({ ...s, class: cls.name, subject: cls.subject }))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Classes</h1>
          <p className="text-muted-foreground">View your assigned classes and schedules</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Classes"
          value={classes.length}
          icon={BookOpen}
        />
        <StatsCard
          title="Total Students"
          value={classes.reduce((acc, c) => acc + c.students, 0)}
          icon={Users}
        />
        <StatsCard
          title="Weekly Hours"
          value={classes.reduce((acc, c) => acc + c.schedule.length, 0)}
          icon={Clock}
          variant="primary"
        />
        <StatsCard
          title="Today's Classes"
          value={todaySchedule.length}
          icon={Calendar}
          variant="success"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="classes" className="space-y-6">
        <TabsList>
          <TabsTrigger value="classes">My Classes</TabsTrigger>
          <TabsTrigger value="timetable">Timetable</TabsTrigger>
        </TabsList>

        {/* Classes Tab */}
        <TabsContent value="classes">
          <AnimatePresence mode="popLayout">
            {classes.length === 0 ? (
              <SimpleCard>
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No classes assigned yet</p>
                  <p className="text-sm text-muted-foreground">
                    Classes will appear here once assigned by admin
                  </p>
                </div>
              </SimpleCard>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {classes.map((cls, index) => (
                  <motion.div
                    key={cls.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <SimpleCard className="hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="flex items-start justify-between mb-4">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                        <Badge variant="secondary">{cls.students} students</Badge>
                      </div>
                      <h3 className="text-lg font-semibold mb-1">{cls.name}</h3>
                      <p className="text-muted-foreground mb-4">{cls.subject}</p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{cls.schedule.length} sessions/week</span>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </SimpleCard>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </TabsContent>

        {/* Timetable Tab */}
        <TabsContent value="timetable">
          <SimpleCard
            title="Weekly Timetable"
            action={
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Days</SelectItem>
                  {days.map((day) => (
                    <SelectItem key={day} value={day}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            }
          >
            {todaySchedule.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">No schedule available</p>
                <p className="text-sm text-muted-foreground">
                  Your timetable will appear here once classes are assigned
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {days.map((day) => {
                  const daySchedule = todaySchedule.filter(
                    (s) => selectedDay === "all" || s.day === selectedDay
                  ).filter((s) => s.day === day);
                  
                  if (daySchedule.length === 0 && selectedDay !== "all") return null;
                  if (daySchedule.length === 0) return null;

                  return (
                    <div key={day}>
                      <h4 className="font-medium mb-3">{day}</h4>
                      <div className="grid gap-2">
                        {daySchedule.map((slot, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                          >
                            <div className="text-center min-w-[80px]">
                              <p className="font-medium">{slot.time}</p>
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{slot.class}</p>
                              <p className="text-sm text-muted-foreground">{slot.subject}</p>
                            </div>
                            <Badge variant="outline">{slot.room}</Badge>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </SimpleCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
