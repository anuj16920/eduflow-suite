import { useState, useRef, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StudentPhotoUploaderProps {
  value: File | null;
  previewUrl: string | null;
  onChange: (file: File | null, preview: string | null) => void;
}

export const StudentPhotoUploader = memo(function StudentPhotoUploader({
  value, previewUrl, onChange,
}: StudentPhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    onChange(file, url);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        whileHover={{ scale: 1.03 }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
        className={cn(
          "relative h-32 w-32 rounded-full border-2 border-dashed cursor-pointer flex items-center justify-center transition-colors overflow-hidden",
          dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
          previewUrl && "border-solid border-primary/30"
        )}
      >
        <AnimatePresence mode="wait">
          {previewUrl ? (
            <motion.img
              key="preview"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              src={previewUrl}
              alt="Student photo"
              className="h-full w-full object-cover"
            />
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-1 text-muted-foreground"
            >
              <Camera className="h-8 w-8" />
              <span className="text-[10px] font-medium">Upload Photo</span>
            </motion.div>
          )}
        </AnimatePresence>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </motion.div>

      {previewUrl && (
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-destructive hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onChange(null, null);
          }}
        >
          <X className="h-3 w-3 mr-1" />Remove Photo
        </Button>
      )}
      {!previewUrl && (
        <p className="text-xs text-muted-foreground">JPG, PNG up to 5MB</p>
      )}
    </div>
  );
});
