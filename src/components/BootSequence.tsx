import React, { useState, useEffect } from 'react';

interface BootSequenceProps {
  onComplete: () => void;
}

export const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [lines, setLines] = useState<string[]>([]);
  
  const bootText = [
    "INITIATING ACM SYSTEM BOOT...",
    "[OK] MEMORY CHECK PASSED",
    "[OK] NETWORK SYNC ESTABLISHED",
    "LOADING DEEP SPACE ASSETS...",
    "[AURORA SCAN INITIATED...]",
    "SYSTEM READY."
  ];

  useEffect(() => {
    let currentLine = 0;
    
    // Type out the lines one by one
    const interval = setInterval(() => {
      if (currentLine < bootText.length) {
        setLines(prev => [...prev, bootText[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        // Wait 1.5 seconds after typing finishes, then trigger completion
        setTimeout(() => {
          onComplete();
        }, 1500);
      }
    }, 800); // 800ms delay between each line

    return () => clearInterval(interval);
  }, []);

  return (
    // This wrapper represents the 'Monitor Screen' area. 
    // If you have a background image of a desk, position this div over the monitor glass.
    <div className="w-full h-screen flex items-center justify-center bg-black z-[100] fixed inset-0">
      
      <div className="w-full max-w-4xl h-[60vh] border-8 border-gray-800 rounded-3xl crt-screen bg-aurora relative p-8 shadow-[0_0_50px_rgba(168,85,247,0.4)] flex flex-col justify-start text-left">
        
        {/* Terminal Text */}
        <div className="font-mono text-cyan-400 text-sm md:text-lg z-10 flex flex-col gap-2">
          {lines.map((line, index) => (
            <div key={index} className="animate-[fadeIn_0.2s_ease-in]">
              <span className="text-purple-500">{'> '}</span> {line}
            </div>
          ))}
          {/* Blinking Cursor */}
          <div className="animate-pulse w-3 h-5 bg-cyan-400 mt-2"></div>
        </div>

        {/* Pixel Rocket Easter Egg */}
        <div className="absolute right-10 bottom-20 text-4xl animate-bounce z-10">
          🚀
        </div>

      </div>
    </div>
  );
};