import { useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList,
  BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { HelpCircle, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  FaceScanCamera, ScanStatusPanel, AttendanceConfirmationCard,
} from "@/components/attendance-face";
import type { FaceScanCameraRef, ScanStatus } from "@/components/attendance-face";

interface RecognizedStudent {
  id: string;
  full_name: string;
  admission_number?: string | null;
  avatar_url?: string | null;
}

export default function FaceAttendancePage() {
  const { toast } = useToast();
  const cameraRef = useRef<FaceScanCameraRef>(null);

  const [status, setStatus] = useState<ScanStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [recognized, setRecognized] = useState<RecognizedStudent | null>(null);
  const [timestamp, setTimestamp] = useState("");

  const handleCapture = useCallback(async () => {
    const frame = cameraRef.current?.captureFrame();
    if (!frame) {
      toast({ title: "Error", description: "Could not capture frame", variant: "destructive" });
      return;
    }

    setStatus("scanning");
    setStatusMessage("Face detected — analyzing...");

    // Short delay for scanning animation
    await new Promise((r) => setTimeout(r, 1200));

    setStatus("processing");
    setStatusMessage("Comparing with registered students...");

    try {
      const { data, error } = await supabase.functions.invoke("face-recognition", {
        body: { capturedImage: frame },
      });

      if (error) throw error;

      if (data?.recognized) {
        setStatus("success");
        setStatusMessage(data.alreadyMarked ? "Already marked today" : "Attendance recorded successfully!");
        setRecognized(data.student);
        setTimestamp(data.timestamp);
      } else {
        setStatus("failure");
        setStatusMessage(data?.message || "Face not recognized. Please try again.");
        setRecognized(null);
      }
    } catch (err: any) {
      console.error("Face recognition error:", err);
      setStatus("failure");
      setStatusMessage(err.message || "Recognition failed. Please try again.");
    }
  }, [toast]);

  const reset = () => {
    setStatus("idle");
    setStatusMessage("");
    setRecognized(null);
    setTimestamp("");
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="space-y-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink href="/admin/attendance">Attendance</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Face Scan</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Face Recognition Attendance</h1>
            <p className="text-sm text-muted-foreground">Mark attendance using facial recognition</p>
          </div>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <HelpCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Camera */}
      <FaceScanCamera ref={cameraRef} status={status} onCapture={handleCapture} />

      {/* Status */}
      <ScanStatusPanel status={status} message={statusMessage} />

      {/* Confirmation */}
      <AnimatePresence>
        {status === "success" && recognized && (
          <AttendanceConfirmationCard student={recognized} timestamp={timestamp} />
        )}
      </AnimatePresence>

      {/* Reset */}
      {(status === "success" || status === "failure") && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center"
        >
          <Button variant="outline" onClick={reset} className="gap-2">
            <RotateCcw className="h-4 w-4" />Scan Another Student
          </Button>
        </motion.div>
      )}
    </div>
  );
}
