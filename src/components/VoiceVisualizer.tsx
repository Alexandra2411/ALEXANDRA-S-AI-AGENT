import React from "react";
import { motion } from "motion/react";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { AgentState } from "../types";

interface VoiceVisualizerProps {
  state: AgentState;
  onToggleMic: () => void;
  isContinuous: boolean;
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({
  state,
  onToggleMic,
  isContinuous,
}) => {
  // Map states to color palettes and subtitles
  const getAgentStatusText = () => {
    switch (state) {
      case "uninitialized":
        return "Click to connect / Cliquez pour connecter";
      case "idle":
        return "Agent Ready • Tap to state questions";
      case "listening":
        return "Listening • Speak now...";
      case "thinking":
        return "Processing with AI...";
      case "speaking":
        return "Alexandra is speaking...";
      default:
        return "Standby";
    }
  };

  const getStatusColor = () => {
    switch (state) {
      case "uninitialized":
        return "text-white/40";
      case "idle":
        return "text-green-300 font-medium";
      case "listening":
        return "text-white font-semibold tracking-wider animate-pulse";
      case "thinking":
        return "text-white/80 font-medium";
      case "speaking":
        return "text-white font-medium";
      default:
        return "text-white/50";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 px-4" id="voice-visualizer">
      {/* Visual Circle Area */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Sleek Interface Ambient glow sphere */}
        <div className="absolute -z-10 w-[320px] h-[320px] bg-red-500/30 rounded-full blur-[70px] pointer-events-none" />

        {/* Pulsating background layers based on state */}
        {state === "listening" && (
          <>
            <motion.div
              className="absolute w-56 h-56 rounded-full bg-white/10 border border-white/20"
              animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0.2, 0.6] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute w-48 h-48 rounded-full bg-white/5 border border-white/10"
              animate={{ scale: [1, 1.35, 1], opacity: [0.7, 0.1, 0.7] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.3 }}
            />
          </>
        )}

        {state === "speaking" && (
          <>
            <motion.div
              className="absolute w-52 h-52 rounded-full bg-white/10 backdrop-blur-md"
              animate={{ scale: [0.98, 1.05, 0.98], borderRadius: ["50%", "47%", "50%"] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
            />
            {/* Active Sound Waves */}
            <div className="absolute flex items-end justify-center gap-1.5 h-16 w-38 bottom-2">
              {[1, 2, 3, 4, 5, 4, 3, 2, 1].map((val, i) => (
                <motion.div
                  key={i}
                  className="w-1 rounded-full bg-white/70"
                  animate={{ height: [`${val * 5}px`, `${val * 14}px`, `${val * 5}px`] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.5 + i * 0.08,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </>
        )}

        {state === "thinking" && (
          <motion.div
            className="absolute w-48 h-48 rounded-full border-2 border-dashed border-white/40"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          />
        )}

        {state === "idle" && (
          <motion.div
            className="absolute w-44 h-44 rounded-full bg-white/5 border border-white/10"
            animate={{ scale: [0.97, 1.03, 0.97] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          />
        )}

        {/* Center Control Circle - Sleek dark glassmorphism */}
        <motion.button
          onClick={onToggleMic}
          className={`relative z-10 w-36 h-36 rounded-full flex flex-col items-center justify-center backdrop-blur-lg border transition-all focus:outline-none focus:ring-4 focus:ring-white/20 cursor-pointer ${
            state === "uninitialized"
              ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
              : state === "listening"
              ? "bg-white text-red-700 border-white hover:bg-white/95 hover:scale-105"
              : state === "speaking"
              ? "bg-white/10 border-white/30 text-white hover:bg-white/20"
              : "bg-white/15 border-white/25 text-white hover:bg-white/25 hover:scale-102"
          }`}
          whileTap={{ scale: 0.95 }}
          id="visualizer-activate-btn"
        >
          {state === "uninitialized" ? (
            <>
              <MicOff className="w-9 h-9 mb-2 opacity-80" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Start Agent</span>
            </>
          ) : state === "listening" ? (
            <>
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <Mic className="w-11 h-11 mb-1 text-red-700" />
              </motion.div>
              <span className="text-[10px] font-bold uppercase tracking-wider animate-pulse">
                Listening
              </span>
            </>
          ) : state === "speaking" ? (
            <>
              <Volume2 className="w-10 h-10 mb-2 text-white animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Speaking</span>
            </>
          ) : state === "thinking" ? (
            <>
              <div className="flex gap-1 mb-2">
                <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">Analyzing</span>
            </>
          ) : (
            <>
              <Mic className="w-9 h-9 mb-2 text-white" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Tap Mic</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Sub-text information */}
      <div className="mt-8 text-center">
        <p className={`text-xs uppercase tracking-widest ${getStatusColor()}`}>{getAgentStatusText()}</p>
        {isContinuous && state !== "uninitialized" && (
          <p className="text-[10px] text-white/40 mt-1.5 font-mono uppercase tracking-wider">
            Hands-Free Active
          </p>
        )}
      </div>
    </div>
  );
};
export default VoiceVisualizer;

