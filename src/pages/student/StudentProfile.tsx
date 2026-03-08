import { SimpleCard } from "@/components/dashboard/StatsCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { GraduationCap, User, Mail, Phone, MapPin, Calendar, Edit } from "lucide-react";

export default function StudentProfile() {
  const { user } = useAuth();
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div><h1 className="text-3xl font-bold">My Profile</h1><p className="text-muted-foreground">Your personal information</p></div>
        <Button variant="ghost"><Edit className="h-4 w-4 mr-2" />Edit Profile</Button>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-center">
          <div className="h-20 w-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center mb-4"><GraduationCap className="h-10 w-10 text-primary-foreground" /></div>
          <h2 className="text-xl font-bold">{user?.email?.split("@")[0] || "Student"}</h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <Badge className="mt-3 bg-emerald-500/10 text-emerald-500">Active</Badge>
        </div>
        <div className="lg:col-span-2">
          <SimpleCard title="Personal Information">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex items-center gap-3"><User className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Full Name</p><p className="font-medium">{user?.email?.split("@")[0] || "Not set"}</p></div></div>
              <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Email</p><p className="font-medium">{user?.email || "Not set"}</p></div></div>
              <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Phone</p><p className="font-medium">Not set</p></div></div>
              <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Address</p><p className="font-medium">Not set</p></div></div>
              <div className="flex items-center gap-3"><Calendar className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Date of Birth</p><p className="font-medium">Not set</p></div></div>
            </div>
          </SimpleCard>
        </div>
      </div>
    </div>
  );
}
