"use client";

import { useEffect, useState } from "react";
import App from "@/App";

export default function Page() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#070114] flex items-center justify-center">
        <div className="text-purple-400 font-mono text-sm animate-pulse">
          LOADING SYSTEMS...
        </div>
      </div>
    );
  }

  return <App />;
}
