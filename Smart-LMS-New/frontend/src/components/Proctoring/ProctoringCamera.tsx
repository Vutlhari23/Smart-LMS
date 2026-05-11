import { useEffect, useRef, useState } from "react";
import api from "../../api/axios";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

interface Props {
  quizId?: number;
}

export default function ProctoringCamera({ quizId }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [warning, setWarning] = useState("");
  const [detecting, setDetecting] = useState(false);
  const previousYawRef = useRef<number | null>(null);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const faceMesh = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });
    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults((results) => {
      const canvas = canvasRef.current;
      if (
        !canvas ||
        !results.multiFaceLandmarks ||
        !results.multiFaceLandmarks[0]
      )
        return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = videoRef.current!.videoWidth;
      canvas.height = videoRef.current!.videoHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const landmarks = results.multiFaceLandmarks[0];
      const leftEye = landmarks[33];
      const rightEye = landmarks[263];
      const nose = landmarks[1];
      const yaw = rightEye.x - leftEye.x;

      if (previousYawRef.current !== null) {
        const yawDelta = Math.abs(yaw - previousYawRef.current);
        if (yawDelta > 0.03) {
          setWarning("Suspicious head movement detected. Please stay focused.");
          api
            .post("/proctoring/logs", {
              quiz_attempt_id: quizId,
              event: "head_movement",
              details: `Yaw delta ${yawDelta.toFixed(3)}`,
            })
            .catch(() => null);
        } else {
          setWarning("");
        }
      }
      previousYawRef.current = yaw;

      ctx.strokeStyle = "#00FF00";
      ctx.lineWidth = 1;
      landmarks.forEach((landmark) => {
        ctx.beginPath();
        ctx.arc(
          landmark.x * canvas.width,
          landmark.y * canvas.height,
          2,
          0,
          2 * Math.PI,
        );
        ctx.fill();
      });
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await faceMesh.send({ image: videoRef.current! });
      },
      width: 640,
      height: 480,
    });

    camera
      .start()
      .then(() => setDetecting(true))
      .catch((error) => console.warn("FaceMesh camera error", error));

    return () => {
      camera.stop();
      setDetecting(false);
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, [quizId]);

  return (
    <section className="rounded-xl bg-white p-6 shadow dark:bg-slate-900">
      <h2 className="text-lg font-semibold">Proctoring Monitor</h2>
      <p className="mt-2 text-slate-600 dark:text-slate-300">
        The webcam uses MediaPipe face tracking to detect head movement and log
        suspicious activity.
      </p>
      <div className="mt-4 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
          <video
            ref={videoRef}
            className="h-64 w-full object-cover"
            playsInline
            muted
          />
          <canvas ref={canvasRef} className="absolute inset-0 h-64 w-full" />
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/70">
          <p className="text-sm text-slate-500 dark:text-slate-400">Status</p>
          <p className="mt-3 text-sm font-medium text-emerald-700 dark:text-emerald-300">
            {detecting ? "Monitoring active" : "Starting sensor..."}
          </p>
          {warning && (
            <p className="mt-3 rounded border border-amber-300 bg-amber-50 p-3 text-amber-800 dark:border-amber-700 dark:bg-amber-950/20 dark:text-amber-200">
              {warning}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
