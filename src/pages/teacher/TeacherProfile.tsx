import { useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, GraduationCap, Award, Edit, Save, Camera } from "lucide-react";
import { SimpleCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface TeacherProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  joiningDate: string;
  qualification: string;
  specialization: string;
  experience: string;
  bio: string;
}

export default function TeacherProfile() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<TeacherProfile>({
    name: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    joiningDate: "",
    qualification: "",
    specialization: "",
    experience: "",
    bio: "",
  });

  const [subjects] = useState<string[]>([]);
  const [classes] = useState<string[]>([]);

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Success",
      description: "Profile updated successfully",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">View and manage your profile information</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="gradient-primary border-0">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1"
        >
          <SimpleCard>
            <div className="text-center">
              <div className="relative inline-block">
                <div className="h-32 w-32 mx-auto rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                  {profile.name ? (
                    <span className="text-4xl font-bold text-primary-foreground">
                      {profile.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                  ) : (
                    <User className="h-16 w-16 text-primary-foreground" />
                  )}
                </div>
                {isEditing && (
                  <Button
                    size="icon"
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <h2 className="mt-4 text-xl font-bold">{profile.name || "Your Name"}</h2>
              <p className="text-muted-foreground">{profile.specialization || "Specialization"}</p>
              <Badge className="mt-2 bg-success/10 text-success">Active</Badge>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{profile.email || "email@school.edu"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{profile.phone || "+91 XXXXX XXXXX"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{profile.address || "Address"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined: {profile.joiningDate || "Not set"}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h4 className="font-medium mb-3">Subjects</h4>
              <div className="flex flex-wrap gap-2">
                {subjects.length > 0 ? (
                  subjects.map((subject) => (
                    <Badge key={subject} variant="secondary">
                      {subject}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">No subjects assigned</span>
                )}
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium mb-3">Classes</h4>
              <div className="flex flex-wrap gap-2">
                {classes.length > 0 ? (
                  classes.map((cls) => (
                    <Badge key={cls} variant="outline">
                      {cls}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">No classes assigned</span>
                )}
              </div>
            </div>
          </SimpleCard>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          <SimpleCard title="Personal Information">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label>Full Name</Label>
                {isEditing ? (
                  <Input
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                ) : (
                  <p className="text-sm py-2">{profile.name || "Not set"}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label>Email</Label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    placeholder="Enter email"
                  />
                ) : (
                  <p className="text-sm py-2">{profile.email || "Not set"}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label>Phone</Label>
                {isEditing ? (
                  <Input
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                ) : (
                  <p className="text-sm py-2">{profile.phone || "Not set"}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label>Date of Birth</Label>
                {isEditing ? (
                  <Input
                    type="date"
                    value={profile.dateOfBirth}
                    onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                  />
                ) : (
                  <p className="text-sm py-2">{profile.dateOfBirth || "Not set"}</p>
                )}
              </div>
              <div className="grid gap-2 md:col-span-2">
                <Label>Address</Label>
                {isEditing ? (
                  <Textarea
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    placeholder="Enter address"
                    rows={2}
                  />
                ) : (
                  <p className="text-sm py-2">{profile.address || "Not set"}</p>
                )}
              </div>
            </div>
          </SimpleCard>

          <SimpleCard title="Professional Information">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label>Qualification</Label>
                {isEditing ? (
                  <Input
                    value={profile.qualification}
                    onChange={(e) => setProfile({ ...profile, qualification: e.target.value })}
                    placeholder="e.g., M.Sc. Mathematics"
                  />
                ) : (
                  <p className="text-sm py-2">{profile.qualification || "Not set"}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label>Specialization</Label>
                {isEditing ? (
                  <Input
                    value={profile.specialization}
                    onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
                    placeholder="e.g., Advanced Mathematics"
                  />
                ) : (
                  <p className="text-sm py-2">{profile.specialization || "Not set"}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label>Experience</Label>
                {isEditing ? (
                  <Input
                    value={profile.experience}
                    onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                    placeholder="e.g., 10 years"
                  />
                ) : (
                  <p className="text-sm py-2">{profile.experience || "Not set"}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label>Joining Date</Label>
                {isEditing ? (
                  <Input
                    type="date"
                    value={profile.joiningDate}
                    onChange={(e) => setProfile({ ...profile, joiningDate: e.target.value })}
                  />
                ) : (
                  <p className="text-sm py-2">{profile.joiningDate || "Not set"}</p>
                )}
              </div>
              <div className="grid gap-2 md:col-span-2">
                <Label>Bio</Label>
                {isEditing ? (
                  <Textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    placeholder="Write a short bio about yourself..."
                    rows={4}
                  />
                ) : (
                  <p className="text-sm py-2">{profile.bio || "Not set"}</p>
                )}
              </div>
            </div>
          </SimpleCard>
        </motion.div>
      </div>
    </div>
  );
}
