import { useState } from "react";
import { Award, TrendingUp, Download } from "lucide-react";
import { SimpleCard, StatsCard } from "@/components/dashboard/StatsCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ParentResults() {
  const [selectedExam, setSelectedExam] = useState("");
  const [results] = useState<{ subject: string; marks: number; maxMarks: number; grade: string }[]>([]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Exam Results</h1><p className="text-muted-foreground">View exam results and report cards</p></div>
        <Button variant="outline"><Download className="h-4 w-4 mr-2" />Download Report Card</Button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Overall Grade" value={results.length > 0 ? "A" : "N/A"} icon={Award} variant="success" />
        <StatsCard title="Percentage" value={results.length > 0 ? "85%" : "N/A"} icon={TrendingUp} variant="primary" />
        <StatsCard title="Class Rank" value={results.length > 0 ? "5" : "N/A"} icon={Award} />
        <StatsCard title="Subjects" value={results.length} icon={Award} />
      </div>
      <SimpleCard title="Results" action={
        <Select value={selectedExam} onValueChange={setSelectedExam}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Select Exam" /></SelectTrigger>
          <SelectContent><SelectItem value="midterm">Mid-Term</SelectItem><SelectItem value="final">Final</SelectItem></SelectContent>
        </Select>
      }>
        {results.length === 0 ? (
          <div className="text-center py-12"><Award className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" /><p className="text-muted-foreground">No results available</p></div>
        ) : (
          <div className="space-y-3">{results.map((r, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-lg border">
              <span className="font-medium">{r.subject}</span>
              <div className="flex items-center gap-4"><span>{r.marks}/{r.maxMarks}</span><Badge>{r.grade}</Badge></div>
            </div>
          ))}</div>
        )}
      </SimpleCard>
    </div>
  );
}
