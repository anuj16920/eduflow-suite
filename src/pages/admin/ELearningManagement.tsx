import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SimpleCard, StatsCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Monitor, BookOpen, FileText, Video, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function ELearningManagement() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    setLoading(true);
    const { data } = await supabase.from("study_materials").select("*, subjects(*), classes(*)");
    if (data) setMaterials(data);
    setLoading(false);
  };

  const typeIcons: Record<string, any> = { document: FileText, video: Video, presentation: Monitor };
  const docs = materials.filter((m) => m.material_type === "document").length;
  const videos = materials.filter((m) => m.material_type === "video").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">E-Learning Portal</h1>
          <p className="text-muted-foreground">Manage study materials, videos, and digital resources</p>
        </div>
        <Button className="gradient-primary border-0 text-primary-foreground"><Plus className="h-4 w-4 mr-2" />Upload Material</Button>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        <StatsCard title="Total Materials" value={materials.length} icon={BookOpen} />
        <StatsCard title="Documents" value={docs} icon={FileText} variant="primary" />
        <StatsCard title="Videos" value={videos} icon={Video} variant="success" />
        <StatsCard title="Subjects" value={new Set(materials.map((m) => m.subject_id)).size} icon={Monitor} variant="warning" />
      </div>

      <SimpleCard title="Study Materials">
        {loading ? (
          <div className="text-center py-12">
            <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-3" />
            <p className="text-muted-foreground">Loading materials...</p>
          </div>
        ) : materials.length === 0 ? (
          <div className="text-center py-12">
            <Monitor className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">No study materials uploaded yet</p>
            <p className="text-sm text-muted-foreground">Teachers can upload materials from their portal</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {materials.map((mat, i) => {
              const Icon = typeIcons[mat.material_type] || FileText;
              return (
                <motion.div
                  key={mat.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold truncate">{mat.title}</h4>
                      <p className="text-xs text-muted-foreground">{mat.subjects?.name || "General"}</p>
                    </div>
                  </div>
                  {mat.description && <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{mat.description}</p>}
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="capitalize">{mat.material_type}</Badge>
                    <span className="text-xs text-muted-foreground">{mat.classes?.name || "All"}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </SimpleCard>
    </div>
  );
}
