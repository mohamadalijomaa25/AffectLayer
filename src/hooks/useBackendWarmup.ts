import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_BACKEND_URL || "https://affectlayer-backend.onrender.com";
const PING_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Pings the Python backend on mount and every 10 minutes.
 * Prevents Render free-tier cold starts so Classical & ML engines
 * respond immediately when the user clicks Analyze.
 *
 * Returns `isWarm` — false until the first successful ping.
 */
export function useBackendWarmup() {
  const [isWarm, setIsWarm] = useState(false);

  useEffect(() => {
    const ping = async () => {
      try {
        const res = await fetch(`${API_URL}/health`, { method: "GET" });
        if (res.ok) setIsWarm(true);
      } catch {
        // Silently ignore — warmup is best-effort
      }
    };

    // Immediate warmup on page load
    ping();

    // Keep-alive every 10 minutes
    const interval = setInterval(ping, PING_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return { isWarm };
}
