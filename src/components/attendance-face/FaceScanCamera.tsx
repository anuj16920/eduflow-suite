import { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle, memo } from "react";
import { motion } from "framer-motion";
import { Camera, CameraOff, SwitchCamera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaceScanFrame } from "./FaceScanFrame";

export type ScanStatus = "idle" | "scanning" | "processing" | "success" | "failure";

export interface FaceScanCameraRef {
  captureFrame: () => string | null;
}

interface FaceScanCameraProps {
  status: ScanStatus;
  onCapture: () => void;
}

export const FaceScanCamera = memo(forwardRef<FaceScanCameraRef, FaceScanCameraProps>(
  function FaceScanCamera({ status, onCapture }, ref) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hasCamera, setHasCamera] = useState(true);
    const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
    const streamRef = useRef<MediaStream | null>(null);

    const startCamera = useCallback(async () => {
      try {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode, width: { ideal: 640 }, height: { ideal: 480 } },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCamera(true);
      } catch {
        setHasCamera(false);
      }
    }, [facingMode]);

    useEffect(() => {
      startCamera();
      return () => { streamRef.current?.getTracks().forEach((t) => t.stop()); };
    }, [startCamera]);

    useImperativeHandle(ref, () => ({
      captureFrame: () => {
        if (!videoRef.current || !canvasRef.current) return null;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return null;
        ctx.drawImage(video, 0, 0);
        return canvas.toDataURL("image/jpeg", 0.8);
      },
    }));

    const toggleCamera = () => setFacingMode((m) => m === "user" ? "environment" : "user");

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-lg mx-auto aspect-[4/3] rounded-2xl overflow-hidden bg-black"
      >
        {hasCamera ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
              style={{ transform: facingMode === "user" ? "scaleX(-1)" : "none" }}
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/20" />
            {/* Scan frame overlay */}
            <FaceScanFrame status={status} />
            {/* Controls */}
            <div className="absolute top-3 right-3 flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 hover:text-white"
                onClick={toggleCamera}
              >
                <SwitchCamera className="h-4 w-4" />
              </Button>
            </div>
            {/* Capture button */}
            {(status === "idle" || status === "failure") && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onCapture}
                  className="h-16 w-16 rounded-full border-4 border-white/80 bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <Camera className="h-6 w-6 text-white" />
                </motion.button>
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-muted">
            <CameraOff className="h-12 w-12 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground text-center px-4">
              Camera permission denied. Please allow camera access to use face recognition.
            </p>
            <Button variant="outline" size="sm" onClick={startCamera}>Retry</Button>
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </motion.div>
    );
  }
));
