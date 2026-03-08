import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { User, Mail, Phone, MapPin, Calendar } from "lucide-react";

export default function StudentProfile() {
  const { profile } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">View and manage your profile information</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {profile?.full_name?.charAt(0) || "S"}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold">{profile?.full_name || "Student"}</h2>
            <p className="text-muted-foreground">{profile?.email}</p>
            <Button className="mt-4 gradient-primary border-0 text-primary-foreground">Edit Profile</Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              { icon: User, label: "Full Name", value: profile?.full_name },
              { icon: Mail, label: "Email", value: profile?.email },
              { icon: Phone, label: "Phone", value: profile?.phone || "Not set" },
              { icon: MapPin, label: "Address", value: profile?.address || "Not set" },
              { icon: Calendar, label: "Date of Birth", value: profile?.date_of_birth || "Not set" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <item.icon className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="font-medium">{item.value}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
