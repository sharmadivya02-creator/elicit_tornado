"use client";

import { useEffect, useState } from "react";
import App from "@/App";
import { BootSequence } from "@/components/BootSequence";

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [booted, setBooted] = useState(false);

  // Handle Next.js client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Initial server/client hydration state
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#070114] flex items-center justify-center">
        <div className="text-purple-400 font-mono text-sm animate-pulse">
          LOADING SYSTEMS...
        </div>
      </div>
    );
  }

  // 2. Play the boot sequence (currently a no-op, completes instantly)
  if (!booted) {
    return <BootSequence onComplete={() => setBooted(true)} />;
  }

  // 3. Render the main website
  return <App />;
}