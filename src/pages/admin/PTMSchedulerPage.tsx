import { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, HelpCircle, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, startOfDay } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  TeacherSelector,
  MeetingCalendar,
  TimeSlotCard,
  BookingPanel,
  MeetingConfirmationCard,
} from "@/components/ptm";
import type { TeacherOption } from "@/components/ptm/TeacherSelector";
import type { TimeSlot } from "@/components/ptm/TimeSlotCard";

// Generate 15-min slots from 9 AM to 4 PM
function generateSlots(): Omit<TimeSlot, "status">[] {
  const slots: Omit<TimeSlot, "status">[] = [];
  for (let h = 9; h < 16; h++) {
    for (let m = 0; m < 60; m += 15) {
      const sh = String(h).padStart(2, "0");
      const sm = String(m).padStart(2, "0");
      const eh = m === 45 ? String(h + 1).padStart(2, "0") : sh;
      const em = m === 45 ? "00" : String(m + 15).padStart(2, "0");
      slots.push({
        id: `${sh}:${sm}`,
        startTime: `${sh}:${sm}`,
        endTime: `${eh}:${em}`,
      });
    }
  }
  return slots;
}

const BASE_SLOTS = generateSlots();

interface ConfirmationData {
  meetingId: string;
  teacherName: string;
  date: Date;
  startTime: string;
  endTime: string;
  meetingLink?: string | null;
}

export default function PTMSchedulerPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [selectedTeacher, setSelectedTeacher] = useState<TeacherOption | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [bookedSlots, setBookedSlots] = useState<Record<string, string[]>>({});
  const [booking, setBooking] = useState(false);
  const [confirmation, setConfirmation] = useState<ConfirmationData | null>(null);
  const [showMyBookings, setShowMyBookings] = useState(false);
  const [myMeetings, setMyMeetings] = useState<any[]>([]);

  // Fetch existing meetings for selected teacher
  useEffect(() => {
    if (!selectedTeacher) { setBookedSlots({}); return; }
    (async () => {
      const { data } = await supabase
        .from("meetings")
        .select("*")
        .eq("scheduled_with", selectedTeacher.profileId)
        .in("status", ["scheduled", "confirmed"]);

      const map: Record<string, string[]> = {};
      data?.forEach((m) => {
        const dateKey = m.meeting_date;
        if (!map[dateKey]) map[dateKey] = [];
        if (m.start_time) map[dateKey].push(m.start_time.slice(0, 5));
      });
      setBookedSlots(map);
    })();
  }, [selectedTeacher]);

  // Fetch user's own meetings
  useEffect(() => {
    if (!user || !showMyBookings) return;
    (async () => {
      const { data } = await supabase
        .from("meetings")
        .select("*")
        .eq("scheduled_by", user.id)
        .order("meeting_date", { ascending: true });
      setMyMeetings(data || []);
    })();
  }, [user, showMyBookings]);

  const availableDates = useMemo(() => {
    // For simplicity, weekdays in the future are available
    const set = new Set<string>();
    const today = startOfDay(new Date());
    for (let i = 0; i < 90; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const dow = d.getDay();
      if (dow > 0 && dow < 6) set.add(format(d, "yyyy-MM-dd"));
    }
    return set;
  }, []);

  const fullyBookedDates = useMemo(() => {
    const set = new Set<string>();
    Object.entries(bookedSlots).forEach(([dateKey, slots]) => {
      if (slots.length >= BASE_SLOTS.length) set.add(dateKey);
    });
    return set;
  }, [bookedSlots]);

  const daySlots: TimeSlot[] = useMemo(() => {
    if (!selectedDate) return [];
    const dateKey = format(selectedDate, "yyyy-MM-dd");
    const booked = bookedSlots[dateKey] || [];
    return BASE_SLOTS.map((s) => ({
      ...s,
      status: selectedSlot?.id === s.id ? "selected" : booked.includes(s.startTime) ? "booked" : "available",
    }));
  }, [selectedDate, bookedSlots, selectedSlot]);

  const handleSlotSelect = useCallback((slot: TimeSlot) => {
    setSelectedSlot((prev) => (prev?.id === slot.id ? null : slot));
  }, []);

  const handleBook = useCallback(async () => {
    if (!user || !selectedTeacher || !selectedDate || !selectedSlot) return;
    setBooking(true);
    try {
      const { data, error } = await supabase.from("meetings").insert({
        title: `PTM with ${selectedTeacher.fullName}`,
        meeting_date: format(selectedDate, "yyyy-MM-dd"),
        start_time: selectedSlot.startTime,
        end_time: selectedSlot.endTime,
        scheduled_by: user.id,
        scheduled_with: selectedTeacher.profileId,
        status: "scheduled",
      }).select().single();

      if (error) throw error;

      setConfirmation({
        meetingId: data.id,
        teacherName: selectedTeacher.fullName,
        date: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        meetingLink: data.meeting_link,
      });

      toast({ title: "Meeting booked!", description: `Your meeting with ${selectedTeacher.fullName} has been scheduled.` });
    } catch (err: any) {
      toast({ title: "Booking failed", description: err.message, variant: "destructive" });
    } finally {
      setBooking(false);
    }
  }, [user, selectedTeacher, selectedDate, selectedSlot, toast]);

  const resetBooking = useCallback(() => {
    setConfirmation(null);
    setSelectedSlot(null);
    setSelectedDate(null);
    setSelectedTeacher(null);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 md:p-6 max-w-[1200px] mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <span>Dashboard</span><span>/</span><span>Interactions</span><span>/</span><span className="text-foreground font-medium">PTM</span>
          </div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-primary" /> Parent Teacher Meeting
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={showMyBookings ? "default" : "outline"}
            size="sm"
            className="rounded-xl gap-2"
            onClick={() => setShowMyBookings(!showMyBookings)}
          >
            <ClipboardList className="h-4 w-4" /> My Bookings
          </Button>
          <Button variant="ghost" size="icon" className="rounded-xl">
            <HelpCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* My Bookings */}
      <AnimatePresence>
        {showMyBookings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <Card className="rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">My Upcoming Meetings</CardTitle>
              </CardHeader>
              <CardContent>
                {myMeetings.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No upcoming meetings.</p>
                ) : (
                  <div className="space-y-2">
                    {myMeetings.map((m) => (
                      <div key={m.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border">
                        <div>
                          <p className="text-sm font-medium">{m.title}</p>
                          <p className="text-xs text-muted-foreground">{m.meeting_date} • {m.start_time?.slice(0, 5)} – {m.end_time?.slice(0, 5)}</p>
                        </div>
                        <Badge variant={m.status === "scheduled" ? "default" : "secondary"} className="text-[10px]">
                          {m.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {confirmation ? (
          <motion.div key="confirmation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-md mx-auto">
            <MeetingConfirmationCard {...confirmation} onClose={resetBooking} />
          </motion.div>
        ) : (
          <motion.div key="scheduler" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Teacher Selector */}
            <Card className="rounded-2xl mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Select Teacher</CardTitle>
              </CardHeader>
              <CardContent>
                <TeacherSelector selected={selectedTeacher} onSelect={setSelectedTeacher} />
              </CardContent>
            </Card>

            {selectedTeacher && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar */}
                <Card className="rounded-2xl lg:col-span-1">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Select Date</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MeetingCalendar
                      currentMonth={currentMonth}
                      onMonthChange={setCurrentMonth}
                      selectedDate={selectedDate}
                      onDateSelect={(d) => { setSelectedDate(d); setSelectedSlot(null); }}
                      availableDates={availableDates}
                      bookedDates={fullyBookedDates}
                    />
                  </CardContent>
                </Card>

                {/* Time Slots */}
                <Card className="rounded-2xl lg:col-span-1">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      {selectedDate ? `Slots for ${format(selectedDate, "MMM d")}` : "Available Slots"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!selectedDate ? (
                      <p className="text-sm text-muted-foreground text-center py-8">Select a date to view available time slots.</p>
                    ) : daySlots.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">No slots available.</p>
                    ) : (
                      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                        {daySlots.map((slot, i) => (
                          <TimeSlotCard key={slot.id} slot={slot} onSelect={handleSlotSelect} index={i} />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Booking Panel */}
                <div className="lg:col-span-1">
                  <BookingPanel
                    teacher={selectedTeacher}
                    date={selectedDate}
                    slot={selectedSlot}
                    onBook={handleBook}
                    loading={booking}
                  />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
