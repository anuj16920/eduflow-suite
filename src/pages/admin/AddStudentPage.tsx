import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList,
  BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ArrowLeft, ArrowRight, User, BookOpen, Phone, Users, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { FormProgressIndicator } from "@/components/students/add-student/FormProgressIndicator";
import { StudentPhotoUploader } from "@/components/students/add-student/StudentPhotoUploader";

const STEPS = [
  { label: "Basic Info", icon: <User className="h-4 w-4" /> },
  { label: "Academic", icon: <BookOpen className="h-4 w-4" /> },
  { label: "Contact", icon: <Phone className="h-4 w-4" /> },
  { label: "Parent", icon: <Users className="h-4 w-4" /> },
];

interface FormData {
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  admission_number: string;
  class_id: string;
  roll_number: string;
  enrollment_date: string;
  blood_group: string;
  email: string;
  phone: string;
  address: string;
  parent_name: string;
  parent_phone: string;
  parent_email: string;
  parent_relationship: string;
}

const initial: FormData = {
  first_name: "", last_name: "", gender: "", date_of_birth: "",
  admission_number: "", class_id: "", roll_number: "", enrollment_date: new Date().toISOString().split("T")[0],
  blood_group: "", email: "", phone: "", address: "",
  parent_name: "", parent_phone: "", parent_email: "", parent_relationship: "father",
};

type Errors = Partial<Record<keyof FormData, string>>;

function validate(step: number, data: FormData): Errors {
  const e: Errors = {};
  if (step === 0) {
    if (!data.first_name.trim()) e.first_name = "First name is required";
    if (!data.last_name.trim()) e.last_name = "Last name is required";
    if (!data.gender) e.gender = "Gender is required";
    if (!data.date_of_birth) e.date_of_birth = "Date of birth is required";
  }
  if (step === 1) {
    if (!data.class_id) e.class_id = "Class is required";
  }
  if (step === 2) {
    if (!data.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = "Invalid email";
    if (data.phone && !/^[+\d\s()-]{7,20}$/.test(data.phone)) e.phone = "Invalid phone number";
  }
  if (step === 3) {
    // Parent info optional
  }
  return e;
}

export default function AddStudentPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [classes, setClasses] = useState<{ id: string; name: string; section: string | null }[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.from("classes").select("id, name, section").then(({ data }) => {
      if (data) setClasses(data);
    });
  }, []);

  const set = useCallback((key: keyof FormData, val: string) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }, []);

  const next = () => {
    const errs = validate(step, form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStep((s) => Math.min(s + 1, 3));
  };

  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    const errs = validate(step, form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);

    try {
      const fullName = `${form.first_name.trim()} ${form.last_name.trim()}`;
      const password = `Student@${Date.now().toString(36)}`;

      // 1. Create auth user via signup
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password,
        options: {
          data: { full_name: fullName, role: "student" },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Failed to create user account");

      const userId = authData.user.id;

      // 2. Update profile with additional info
      await supabase.from("profiles").update({
        phone: form.phone || null,
        gender: form.gender || null,
        date_of_birth: form.date_of_birth || null,
        address: form.address || null,
      }).eq("id", userId);

      // 3. Upload photo if provided
      let avatarUrl: string | null = null;
      if (photo) {
        const ext = photo.name.split(".").pop();
        const path = `${userId}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("student-photos")
          .upload(path, photo, { upsert: true });
        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from("student-photos")
            .getPublicUrl(path);
          avatarUrl = urlData.publicUrl;
          await supabase.from("profiles").update({ avatar_url: avatarUrl }).eq("id", userId);
        }
      }

      // 4. Create student record
      const { data: studentData, error: studentError } = await supabase.from("students").insert({
        profile_id: userId,
        class_id: form.class_id || null,
        roll_number: form.roll_number ? parseInt(form.roll_number) : null,
        admission_number: form.admission_number || null,
        blood_group: form.blood_group || null,
        admission_date: form.enrollment_date || null,
        status: "active",
      }).select("id").single();

      if (studentError) throw studentError;

      // 5. Create parent if info provided
      if (form.parent_name.trim() && form.parent_email.trim()) {
        // Create parent auth user
        const parentPw = `Parent@${Date.now().toString(36)}`;
        const { data: parentAuth } = await supabase.auth.signUp({
          email: form.parent_email,
          password: parentPw,
          options: { data: { full_name: form.parent_name.trim(), role: "parent" } },
        });

        if (parentAuth?.user) {
          await supabase.from("profiles").update({
            phone: form.parent_phone || null,
          }).eq("id", parentAuth.user.id);

          const { data: parentRecord } = await supabase.from("parents").insert({
            profile_id: parentAuth.user.id,
            relationship: form.parent_relationship || "father",
            occupation: null,
          }).select("id").single();

          if (parentRecord && studentData) {
            await supabase.from("parent_students").insert({
              parent_id: parentRecord.id,
              student_id: studentData.id,
            });
          }
        }
      }

      toast({ title: "Student Registered", description: `${fullName} has been successfully registered.` });
      navigate(`/admin/students/${studentData?.id}`);
    } catch (err: any) {
      toast({ title: "Registration Failed", description: err.message || "An error occurred", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const Field = ({ label, name, required, children }: { label: string; name: keyof FormData; required?: boolean; children: React.ReactNode }) => (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
      {errors[name] && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-destructive">
          {errors[name]}
        </motion.p>
      )}
    </div>
  );

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/admin/students")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink href="/admin/students">Students</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Add Student</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Register New Student</h1>
        <p className="text-sm text-muted-foreground">Fill in the details below to enroll a new student</p>
      </div>

      {/* Progress */}
      <div className="rounded-2xl bg-card border border-border/50 p-6">
        <FormProgressIndicator steps={STEPS} currentStep={step} />
      </div>

      {/* Form sections */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl bg-card border border-border/50 p-6"
        >
          {step === 0 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Student Basic Information</h3>
              <StudentPhotoUploader value={photo} previewUrl={photoPreview} onChange={(f, p) => { setPhoto(f); setPhotoPreview(p); }} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="First Name" name="first_name" required>
                  <Input value={form.first_name} onChange={(e) => set("first_name", e.target.value)} placeholder="John" />
                </Field>
                <Field label="Last Name" name="last_name" required>
                  <Input value={form.last_name} onChange={(e) => set("last_name", e.target.value)} placeholder="Doe" />
                </Field>
                <Field label="Gender" name="gender" required>
                  <Select value={form.gender} onValueChange={(v) => set("gender", v)}>
                    <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Date of Birth" name="date_of_birth" required>
                  <Input type="date" value={form.date_of_birth} onChange={(e) => set("date_of_birth", e.target.value)} />
                </Field>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Academic Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Admission Number" name="admission_number">
                  <Input value={form.admission_number} onChange={(e) => set("admission_number", e.target.value)} placeholder="ADM-2026-001" />
                </Field>
                <Field label="Class / Section" name="class_id" required>
                  <Select value={form.class_id} onValueChange={(v) => set("class_id", v)}>
                    <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                    <SelectContent>
                      {classes.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}{c.section ? ` - ${c.section}` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Roll Number" name="roll_number">
                  <Input type="number" value={form.roll_number} onChange={(e) => set("roll_number", e.target.value)} placeholder="1" />
                </Field>
                <Field label="Enrollment Date" name="enrollment_date">
                  <Input type="date" value={form.enrollment_date} onChange={(e) => set("enrollment_date", e.target.value)} />
                </Field>
                <Field label="Blood Group" name="blood_group">
                  <Select value={form.blood_group} onValueChange={(v) => set("blood_group", v)}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                        <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Student Email" name="email" required>
                  <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="student@email.com" />
                </Field>
                <Field label="Phone Number" name="phone">
                  <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 XXXXX XXXXX" />
                </Field>
              </div>
              <Field label="Address" name="address">
                <Textarea value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Full address" rows={3} />
              </Field>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Parent / Guardian Information</h3>
              <p className="text-sm text-muted-foreground">Optional — a parent account will be created if email is provided</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Parent Name" name="parent_name">
                  <Input value={form.parent_name} onChange={(e) => set("parent_name", e.target.value)} placeholder="Parent full name" />
                </Field>
                <Field label="Relationship" name="parent_relationship">
                  <Select value={form.parent_relationship} onValueChange={(v) => set("parent_relationship", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="father">Father</SelectItem>
                      <SelectItem value="mother">Mother</SelectItem>
                      <SelectItem value="guardian">Guardian</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Parent Email" name="parent_email">
                  <Input type="email" value={form.parent_email} onChange={(e) => set("parent_email", e.target.value)} placeholder="parent@email.com" />
                </Field>
                <Field label="Parent Phone" name="parent_phone">
                  <Input value={form.parent_phone} onChange={(e) => set("parent_phone", e.target.value)} placeholder="+91 XXXXX XXXXX" />
                </Field>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={step === 0 ? () => navigate("/admin/students") : prev}>
          {step === 0 ? "Cancel" : <><ArrowLeft className="h-4 w-4 mr-2" />Previous</>}
        </Button>
        {step < 3 ? (
          <Button onClick={next} className="gradient-primary border-0 text-primary-foreground">
            Next<ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="gradient-primary border-0 text-primary-foreground min-w-[160px]"
          >
            {submitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Registering...</> : "Submit Registration"}
          </Button>
        )}
      </div>
    </div>
  );
}
