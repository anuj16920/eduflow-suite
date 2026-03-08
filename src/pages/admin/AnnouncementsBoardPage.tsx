import { useState, useEffect, useMemo } from "react";
import { Bell, Megaphone, AlertTriangle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SimpleCard, StatsCard } from "@/components/dashboard/StatsCard";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  AnnouncementFiltersPanel, AnnouncementCard, AnnouncementDetailModal,
} from "@/components/announcements";
import type { AnnouncementCardData } from "@/components/announcements";

export default function AnnouncementsBoardPage() {
  const [announcementsRaw, setAnnouncementsRaw] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedPriority, setSelectedPriority] = useState("all");
  const [selectedAudience, setSelectedAudience] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<AnnouncementCardData | null>(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setAnnouncementsRaw(data);
    setLoading(false);
  };

  const allAnnouncements: AnnouncementCardData[] = useMemo(
    () =>
      announcementsRaw.map((a: any) => ({
        id: a.id,
        title: a.title,
        message: a.message,
        priority: a.priority,
        targetAudience: a.target_audience,
        postedBy: a.posted_by,
        createdAt: a.created_at,
        attachmentUrl: a.attachment_url,
        isActive: a.is_active,
      })),
    [announcementsRaw]
  );

  const filtered = useMemo(() => {
    return allAnnouncements.filter((a) => {
      if (selectedPriority !== "all" && a.priority !== selectedPriority) return false;
      if (selectedAudience !== "all" && a.targetAudience !== selectedAudience) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!a.title.toLowerCase().includes(q) && !a.message.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [allAnnouncements, selectedPriority, selectedAudience, search]);

  const stats = useMemo(() => ({
    total: allAnnouncements.length,
    high: allAnnouncements.filter((a) => a.priority === "high").length,
    active: allAnnouncements.filter((a) => a.isActive).length,
    withAttachment: allAnnouncements.filter((a) => a.attachmentUrl).length,
  }), [allAnnouncements]);

  const resetFilters = () => {
    setSelectedPriority("all");
    setSelectedAudience("all");
    setSearch("");
  };

  return (
    <div className="space-y-8">
      <div>
        <Breadcrumb className="mb-2">
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Announcements</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-3xl font-bold">Announcements</h1>
        <p className="text-muted-foreground">Campus notices, events, and important updates</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard title="Total" value={stats.total} icon={Bell} />
        <StatsCard title="Urgent" value={stats.high} icon={AlertTriangle} variant="destructive" />
        <StatsCard title="Active" value={stats.active} icon={CheckCircle2} variant="success" />
        <StatsCard title="With Files" value={stats.withAttachment} icon={Megaphone} variant="primary" />
      </div>

      <AnnouncementFiltersPanel
        selectedPriority={selectedPriority}
        onPriorityChange={setSelectedPriority}
        selectedAudience={selectedAudience}
        onAudienceChange={setSelectedAudience}
        search={search}
        onSearchChange={setSearch}
        onReset={resetFilters}
      />

      <SimpleCard title={`Announcements (${filtered.length})`}>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Bell className="h-14 w-14 mx-auto text-muted-foreground/20 mb-4" />
            <p className="text-muted-foreground font-medium">No announcements found</p>
            <p className="text-sm text-muted-foreground/60">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((a, i) => (
              <AnnouncementCard
                key={a.id}
                announcement={a}
                index={i}
                onClick={() => setSelected(a)}
              />
            ))}
          </div>
        )}
      </SimpleCard>

      <AnnouncementDetailModal
        announcement={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
