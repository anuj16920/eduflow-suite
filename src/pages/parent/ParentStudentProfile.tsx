import { useState } from "react";
import { GraduationCap, User, Mail, Phone, MapPin, Calendar, Award, BookOpen } from "lucide-react";
import { SimpleCard } from "@/components/dashboard/StatsCard";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function ParentStudentProfile() {
  const [student] = useState({
    name: "",
    class: "",
    rollNo: "",
    admissionNo: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    address: "",
    email: "",
    phone: "",
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Student Profile</h1>
        <p className="text-muted-foreground">View your child's profile information</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <SimpleCard>
            <div className="text-center">
              <div className="h-24 w-24 mx-auto rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <GraduationCap className="h-12 w-12 text-primary-foreground" />
              </div>
              <h2 className="mt-4 text-xl font-bold">{student.name || "Student Name"}</h2>
              <p className="text-muted-foreground">{student.class || "Class"}</p>
              <Badge className="mt-2 bg-success/10 text-success">Active</Badge>
            </div>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Roll No:</span><span>{student.rollNo || "-"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Admission No:</span><span>{student.admissionNo || "-"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Date of Birth:</span><span>{student.dateOfBirth || "-"}</span></div>
            </div>
          </SimpleCard>
        </motion.div>

        <div className="lg:col-span-2 space-y-6">
          <SimpleCard title="Personal Information">
            <div className="grid gap-4 md:grid-cols-2 text-sm">
              <div><p className="text-muted-foreground">Full Name</p><p className="font-medium">{student.name || "Not set"}</p></div>
              <div><p className="text-muted-foreground">Gender</p><p className="font-medium">{student.gender || "Not set"}</p></div>
              <div><p className="text-muted-foreground">Blood Group</p><p className="font-medium">{student.bloodGroup || "Not set"}</p></div>
              <div><p className="text-muted-foreground">Date of Birth</p><p className="font-medium">{student.dateOfBirth || "Not set"}</p></div>
              <div className="md:col-span-2"><p className="text-muted-foreground">Address</p><p className="font-medium">{student.address || "Not set"}</p></div>
            </div>
          </SimpleCard>
          <SimpleCard title="Contact Information">
            <div className="grid gap-4 md:grid-cols-2 text-sm">
              <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /><span>{student.email || "Not set"}</span></div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /><span>{student.phone || "Not set"}</span></div>
            </div>
          </SimpleCard>
        </div>
      </div>
    </div>
  );
}
