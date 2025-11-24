import React, { useEffect, useRef, useState } from "react";
import { X, ChevronUp } from "lucide-react";
import AudioWaveform from "./AudioWaveform";

// RealEstateAgentVoice.tsx
interface RealEstateAgentVoiceProps {
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onClose?: () => void;
  sessionStatus?: string | undefined | null;
  agentName?: string | undefined | null;
  anchorElement?: HTMLElement | null; // ← new prop
}

const RealEstateAgentVoice: React.FC<RealEstateAgentVoiceProps> = ({
  isExpanded = false,
  onToggleExpand = () => {},
  onClose,
  sessionStatus,
  agentName,
  anchorElement,
}) => {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const formatDuration = (s: number): string => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  useEffect(() => {
    if (agentName) {
      setSeconds(0);
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [agentName]);

  const handleClose = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    onClose?.();
  };

  // Dynamic styles based on anchor
  const getPositionStyle = (): React.CSSProperties => {
    if (!anchorElement || !containerRef.current) {
      // Fallback: center bottom like before
      return {
        position: "fixed",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 50,
      };
    }

    const rect = anchorElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // If card is in lower half of screen → place above it
    // If card is in upper half → place below it
    const spaceBelow = viewportHeight - rect.bottom;
    const shouldPlaceAbove = spaceBelow < 120; // not enough space below

    return {
      position: "fixed",
      left: rect.left + rect.width / 2,
      [shouldPlaceAbove ? "bottom" : "top"]: shouldPlaceAbove
        ? viewportHeight - rect.top + 12
        : rect.bottom + 12,
      transform: "translateX(-50%)",
      zIndex: 50,
    };
  };

  return (
    <div
      ref={containerRef}
      style={getPositionStyle()}
      className="flex items-center gap-2 pointer-events-auto"
    >
      <div className="bg-black text-white rounded-full flex items-center pl-3 pr-1 py-1 shadow-2xl border border-gray-800">
        <div className="flex items-center gap-2">
          <AudioWaveform />
          <span className="text-sm font-medium whitespace-nowrap">
            {agentName || "Agent"}
          </span>
          <span className="text-xs text-gray-400 ml-1">
            {formatDuration(seconds)}
          </span>
          <button
            onClick={onToggleExpand}
            className="p-1 rounded-full hover:bg-gray-800 transition-colors"
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            <ChevronUp
              size={18}
              className={`transform transition-transform ${
                isExpanded ? "" : "rotate-180"
              }`}
            />
          </button>
        </div>
      </div>

      <button
        onClick={handleClose}
        className="bg-red-500 hover:bg-red-600 transition-colors p-2 rounded-full shadow-lg"
        aria-label="Close"
      >
        <X size={20} className="text-white" />
      </button>
    </div>
  );
};

export default RealEstateAgentVoice;
