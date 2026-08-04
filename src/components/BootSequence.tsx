import React, { useEffect } from 'react';

interface BootSequenceProps {
  onComplete: () => void;
}

export const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  
  // Instantly trigger the completion callback as soon as the component mounts
  useEffect(() => {
    onComplete();
  }, [onComplete]);

  // Render absolutely nothing to the screen
  return null;
};