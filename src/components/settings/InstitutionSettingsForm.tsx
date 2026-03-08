import { useState, useCallback } from "react";
import { School, Save, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface InstitutionData {
  name: string;
  address: string;
  email: string;
  phone: string;
  website: string;
  principalName: string;
  establishedYear: string;
}

export function InstitutionSettingsForm() {
  const { toast } = useToast();
  const [data, setData] = useState<InstitutionData>({
    name: "",
    address: "",
    email: "",
    phone: "",
    website: "",
    principalName: "",
    establishedYear: "",
  });
  const [saving, setSaving] = useState(false);

  const update = useCallback((field: keyof InstitutionData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = useCallback(() => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast({ title: "Success", description: "Institution settings saved successfully" });
    }, 600);
  }, [toast]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border border-border bg-card p-6 space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <School className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Institution Information</h3>
          <p className="text-sm text-muted-foreground">Basic details about your institution</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Institution Name</Label>
          <Input value={data.name} onChange={(e) => update("name", e.target.value)} placeholder="Enter institution name" className="rounded-lg" />
        </div>
        <div className="space-y-2">
          <Label>Principal / Director Name</Label>
          <Input value={data.principalName} onChange={(e) => update("principalName", e.target.value)} placeholder="Enter name" className="rounded-lg" />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" value={data.email} onChange={(e) => update("email", e.target.value)} placeholder="institution@email.com" className="rounded-lg" />
        </div>
        <div className="space-y-2">
          <Label>Phone</Label>
          <Input value={data.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+91 XXXXX XXXXX" className="rounded-lg" />
        </div>
        <div className="space-y-2">
          <Label>Website</Label>
          <Input value={data.website} onChange={(e) => update("website", e.target.value)} placeholder="https://www.institution.edu" className="rounded-lg" />
        </div>
        <div className="space-y-2">
          <Label>Established Year</Label>
          <Input value={data.establishedYear} onChange={(e) => update("establishedYear", e.target.value)} placeholder="e.g., 1990" className="rounded-lg" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Address</Label>
        <Textarea value={data.address} onChange={(e) => update("address", e.target.value)} placeholder="Enter complete address" rows={3} className="rounded-lg" />
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="gradient-primary border-0 text-primary-foreground rounded-xl">
          <Save className="h-4 w-4 mr-2" />{saving ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </motion.div>
  );
}
