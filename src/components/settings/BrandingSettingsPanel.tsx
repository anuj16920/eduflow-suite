import { useState, useCallback, useRef } from "react";
import { Palette, Upload, X, Save, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const THEME_COLORS = [
  { name: "Blue", value: "#3b82f6" },
  { name: "Indigo", value: "#6366f1" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Emerald", value: "#10b981" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Slate", value: "#64748b" },
];

export function BrandingSettingsPanel() {
  const { toast } = useToast();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [themeColor, setThemeColor] = useState("#6366f1");
  const [customColor, setCustomColor] = useState("#6366f1");
  const [saving, setSaving] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (type: "logo" | "favicon") => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      if (type === "logo") setLogoPreview(url);
      else setFaviconPreview(url);
    },
    []
  );

  const handleSave = useCallback(() => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast({ title: "Success", description: "Branding settings saved successfully" });
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
          <Palette className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Branding Settings</h3>
          <p className="text-sm text-muted-foreground">Customize your platform appearance</p>
        </div>
      </div>

      {/* Logo Upload */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <Label>Institution Logo</Label>
          <div className="flex items-center gap-4">
            <AnimatePresence mode="wait">
              {logoPreview ? (
                <motion.div key="preview" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative h-24 w-24 rounded-xl border border-border overflow-hidden">
                  <img src={logoPreview} alt="Logo" className="h-full w-full object-cover" />
                  <button onClick={() => setLogoPreview(null)} className="absolute top-1 right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center">
                    <X className="h-3 w-3" />
                  </button>
                </motion.div>
              ) : (
                <motion.div key="placeholder" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="h-24 w-24 rounded-xl border-2 border-dashed border-border flex items-center justify-center bg-muted/50 cursor-pointer" onClick={() => logoInputRef.current?.click()}>
                  <Image className="h-8 w-8 text-muted-foreground" />
                </motion.div>
              )}
            </AnimatePresence>
            <div>
              <Button variant="outline" size="sm" className="rounded-lg" onClick={() => logoInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />Upload Logo
              </Button>
              <p className="text-xs text-muted-foreground mt-2">PNG, JPG up to 2MB. 200×200px recommended.</p>
            </div>
          </div>
          <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange("logo")} />
        </div>

        {/* Favicon Upload */}
        <div className="space-y-3">
          <Label>Favicon</Label>
          <div className="flex items-center gap-4">
            <AnimatePresence mode="wait">
              {faviconPreview ? (
                <motion.div key="preview" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative h-16 w-16 rounded-lg border border-border overflow-hidden">
                  <img src={faviconPreview} alt="Favicon" className="h-full w-full object-cover" />
                  <button onClick={() => setFaviconPreview(null)} className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center">
                    <X className="h-2.5 w-2.5" />
                  </button>
                </motion.div>
              ) : (
                <motion.div key="placeholder" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="h-16 w-16 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted/50 cursor-pointer" onClick={() => faviconInputRef.current?.click()}>
                  <Image className="h-5 w-5 text-muted-foreground" />
                </motion.div>
              )}
            </AnimatePresence>
            <div>
              <Button variant="outline" size="sm" className="rounded-lg" onClick={() => faviconInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />Upload Favicon
              </Button>
              <p className="text-xs text-muted-foreground mt-2">ICO or PNG, 32×32px recommended.</p>
            </div>
          </div>
          <input ref={faviconInputRef} type="file" accept="image/*,.ico" className="hidden" onChange={handleFileChange("favicon")} />
        </div>
      </div>

      {/* Theme Color */}
      <div className="space-y-3">
        <Label>Primary Theme Color</Label>
        <div className="flex flex-wrap gap-3">
          {THEME_COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => { setThemeColor(color.value); setCustomColor(color.value); }}
              className={`h-10 w-10 rounded-full border-2 transition-all ${themeColor === color.value ? "border-foreground scale-110 shadow-lg" : "border-transparent hover:scale-105"}`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
        <div className="flex items-center gap-3 mt-2">
          <Label className="text-xs text-muted-foreground whitespace-nowrap">Custom:</Label>
          <Input
            type="color"
            value={customColor}
            onChange={(e) => { setCustomColor(e.target.value); setThemeColor(e.target.value); }}
            className="h-9 w-14 p-1 rounded-lg cursor-pointer"
          />
          <Input
            value={customColor}
            onChange={(e) => { setCustomColor(e.target.value); setThemeColor(e.target.value); }}
            placeholder="#6366f1"
            className="w-28 rounded-lg font-mono text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="gradient-primary border-0 text-primary-foreground rounded-xl">
          <Save className="h-4 w-4 mr-2" />{saving ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </motion.div>
  );
}
