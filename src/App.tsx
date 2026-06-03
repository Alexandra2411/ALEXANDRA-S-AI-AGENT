import { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Square, 
  Languages, 
  Trash2, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Settings, 
  Sparkles, 
  ArrowRight,
  Info
} from "lucide-react";
import { cvDataEn, cvDataFr } from "./data/cvData";
import { VoiceVisualizer } from "./components/VoiceVisualizer";
import { CvOverview } from "./components/CvOverview";
import { Message, AgentState } from "./types";

const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export default function App() {
  // State for agent initialization and control
  const [agentState, setAgentState] = useState<AgentState>("uninitialized");
  const [messages, setMessages] = useState<Message[]>([]);
  const [cvLang, setCvLang] = useState<"en" | "fr">("en");
  
  // Backups and fallback controls
  const [manualInput, setManualInput] = useState("");
  const [recognitionSupported, setRecognitionSupported] = useState(false);
  const [isContinuousMode, setIsContinuousMode] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  
  // Voice selection state
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedEnVoiceName, setSelectedEnVoiceName] = useState<string>("");
  const [selectedFrVoiceName, setSelectedFrVoiceName] = useState<string>("");

  // Refs for managing browser speech recognition and synthesis
  const recognitionRef = useRef<any>(null);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const selectEnVoiceRef = useRef<HTMLSelectElement>(null);
  const selectFrVoiceRef = useRef<HTMLSelectElement>(null);

  // Check speech recognition capability on mount
  useEffect(() => {
    if (SpeechRecognition) {
      setRecognitionSupported(true);
      const recog = new SpeechRecognition();
      recog.continuous = false; // process utterance-by-utterance
      recog.interimResults = false;
      recog.maxAlternatives = 1;
      recognitionRef.current = recog;
    }

    // Load synth voices
    const loadVoices = () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);

        // Try to pick sensible default voices
        const enVoice = availableVoices.find(v => v.lang.startsWith("en") && v.name.includes("Google"));
        const frVoice = availableVoices.find(v => v.lang.startsWith("fr") && v.name.includes("Google"));
        
        if (enVoice) setSelectedEnVoiceName(enVoice.name);
        else {
          const fallbackEn = availableVoices.find(v => v.lang.startsWith("en"));
          if (fallbackEn) setSelectedEnVoiceName(fallbackEn.name);
        }

        if (frVoice) setSelectedFrVoiceName(frVoice.name);
        else {
          const fallbackFr = availableVoices.find(v => v.lang.startsWith("fr"));
          if (fallbackFr) setSelectedFrVoiceName(fallbackFr.name);
        }
      }
    };

    loadVoices();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      stopAllSpeech();
    };
  }, []);

  // Configure Speech Recognition callbacks when agentState, cvLang or isContinuousMode changes
  useEffect(() => {
    if (!recognitionRef.current) return;

    const recog = recognitionRef.current;

    // Set recognition language matching current CV language / preference
    recog.lang = cvLang === "fr" ? "fr-FR" : "en-US";

    recog.onstart = () => {
      setAgentState("listening");
    };

    recog.onresult = async (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      if (transcript && transcript.trim()) {
        await handleSendMessage(transcript);
      }
    };

    recog.onerror = (event: any) => {
      console.warn("Speech recognition error:", event.error);
      // If no-speech error, seamlessly return to idle/ready
      if (event.error === "no-speech") {
        setAgentState("idle");
        // If continuous mode is active, retry listening after a brief pause
        if (isContinuousMode && agentState !== "uninitialized") {
          setTimeout(() => {
            startListeningSequence();
          }, 300);
        }
      } else {
        setAgentState("idle");
      }
    };

    recog.onend = () => {
      // If we are currently "listening" but it ended, reset or trigger continuous mode
      setAgentState((prev) => {
        if (prev === "listening") {
          return "idle";
        }
        return prev;
      });
    };
  }, [cvLang, isContinuousMode, agentState]);

  // Scroll to bottom of chat history on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Functions to handle Speech Synthesis
  const stopAllSpeech = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    activeUtteranceRef.current = null;
  };

  const speakText = (text: string, langCode: "en" | "fr") => {
    stopAllSpeech();

    if (isAudioMuted) {
      setAgentState("idle");
      return;
    }

    if (typeof window === "undefined" || !window.speechSynthesis) {
      setAgentState("idle");
      return;
    }

    // Clean up text for clearer speech synth (strip any rogue characters or symbols)
    const cleanedText = text
      .replace(/[*#_`]/g, "")
      .replace(/https?:\/\/\S+/g, "")
      .trim();

    if (!cleanedText) {
      setAgentState("idle");
      return;
    }

    // Trigger state
    setAgentState("speaking");

    // Use a small delay to let window.speechSynthesis.cancel() fully propagate inside the browser's speech engine.
    // This successfully bypasses a known Chrome/Safari bug where immediate speak commands after cancel are swallowed.
    setTimeout(() => {
      if (isAudioMuted) {
        setAgentState("idle");
        return;
      }

      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        const utterance = new SpeechSynthesisUtterance(cleanedText);
        utterance.lang = langCode === "fr" ? "fr-FR" : "en-US";

        // Set selected voice
        const foundVoice = voices.find(
          (v) => v.name === (langCode === "fr" ? selectedFrVoiceName : selectedEnVoiceName)
        );
        if (foundVoice) {
          utterance.voice = foundVoice;
        }

        utterance.onend = () => {
          activeUtteranceRef.current = null;
          setAgentState("idle");

          // Auto resume listing in continuous mode! Hands-free conversation experience!
          if (isContinuousMode) {
            setTimeout(() => {
              startListeningSequence();
            }, 300);
          }
        };

        utterance.onerror = (e) => {
          console.error("Speech Synthesis Error:", e);
          activeUtteranceRef.current = null;
          setAgentState("idle");
        };

        activeUtteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.error("Error trigger speech synthesis:", err);
        setAgentState("idle");
      }
    }, 80);
  };

  // Safe method to start listening sequence
  const startListeningSequence = () => {
    if (!recognitionRef.current) return;
    stopAllSpeech();

    try {
      recognitionRef.current.start();
    } catch (e) {
      // Already running, ignore
    }
  };

  // Activate agent and play the required starting prompt
  const initializeAgent = () => {
    stopAllSpeech();
    
    // Clear previous history
    const initialGreeting = "Hello I am Alexandra Ai agent, how can I help you ?";
    const firstMsg: Message = {
      id: "initial-welcome",
      role: "assistant",
      content: initialGreeting,
      timestamp: new Date(),
    };

    setMessages([firstMsg]);
    setAgentState("idle");

    // Speak initial greeting out loud immediately
    setTimeout(() => {
      speakText(initialGreeting, "en");
    }, 100);
  };

  // Toggle mic for manual listening
  const handleToggleMic = () => {
    if (agentState === "uninitialized") {
      initializeAgent();
      return;
    }

    if (agentState === "listening") {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setAgentState("idle");
    } else {
      startListeningSequence();
    }
  };

  // Stop everything
  const handleStopAll = () => {
    stopAllSpeech();
    try {
      recognitionRef.current.stop();
    } catch (e) {}
    setAgentState("idle");
  };

  // Chat message sender
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Stop current speech output if user interrupts by typing/speaking
    stopAllSpeech();

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date(),
    };

    // Stagger user input into list
    setMessages((prev) => [...prev, userMsg]);
    setAgentState("thinking");
    setManualInput("");

    try {
      // Post coordinates to server API route proxying Gemini API request
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          // Limit history depth is clean and performant
          history: messages.slice(-10),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed response from voice agent server.");
      }

      const data = await response.json();
      const replyText = data.reply || "I am sorry, I did not catch that correctly.";

      const aiMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: replyText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);

      // Detect language returned in the reply to speak in the correct voice accent
      const isEnglishReply = !/[éèàùçâêîôûëïü]/.test(replyText.toLowerCase()) || 
                             replyText.toLowerCase().includes("hello") || 
                             replyText.toLowerCase().includes("experiences") || 
                             replyText.toLowerCase().includes("schools");
      
      const replyLangCode = isEnglishReply ? "en" : "fr";

      // Instantly speak the text response
      speakText(replyText, replyLangCode);

    } catch (err) {
      console.error(err);
      const errMsg: Message = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: "There was a connection issue with Alexandra's Voice Agent Server. Please make sure the server endpoint is available.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
      setAgentState("idle");
    }
  };

  // Clear Chat History completely and reset
  const handleClearHistory = () => {
    stopAllSpeech();
    setMessages([]);
    setAgentState("idle");
  };

  // Render list of languages voice models
  const enVoicesList = voices.filter(v => v.lang.startsWith("en"));
  const frVoicesList = voices.filter(v => v.lang.startsWith("fr"));

  return (
    <div className="min-h-screen bg-red-700 text-white flex flex-col antialiased font-sans relative overflow-x-hidden" id="app-root-container">
      {/* Dynamic ambient sphere background decoration to look gorgeous like of a smart assistant */}
      <div className="absolute top-[20%] left-[-100px] w-[500px] h-[500px] bg-red-500 rounded-full blur-[140px] opacity-35 pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-100px] w-[500px] h-[500px] bg-rose-500 rounded-full blur-[140px] opacity-30 pointer-events-none" />

      {/* Sleek Interface Header */}
      <header className="w-full bg-red-700/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-20" id="app-header">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-700 font-bold text-xl shadow-md">A</div>
            <span className="text-xl font-light tracking-widest uppercase text-white">Alexandra <span className="font-bold">CV AI</span></span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex bg-red-800 rounded-full p-1 border border-white/5">
              <button
                onClick={() => setCvLang("en")}
                className={`px-6 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer ${
                  cvLang === "en" ? "bg-white text-red-700 font-bold shadow-md" : "text-white/60 hover:text-white"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setCvLang("fr")}
                className={`px-6 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer ${
                  cvLang === "fr" ? "bg-white text-red-700 font-bold shadow-md" : "text-white/60 hover:text-white"
                }`}
              >
                FR
              </button>
            </div>
            <div className="flex items-center gap-2 opacity-85 shrink-0">
              <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs uppercase tracking-widest text-white/80 font-mono font-medium">System Online</span>
            </div>
            
            {/* Audio Mute toggle */}
            <button
              onClick={() => {
                setIsAudioMuted(!isAudioMuted);
                if (!isAudioMuted) stopAllSpeech();
              }}
              className={`p-2.5 border rounded-full transition-all cursor-pointer ${
                isAudioMuted
                  ? "border-red-400 bg-red-550 text-white"
                  : "border-white/10 text-white/60 hover:text-white hover:bg-white/5"
              }`}
              id="audio-mute-toggle"
              title={isAudioMuted ? "Unmute Voice" : "Mute Voice"}
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Interface Layout Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-6 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10" id="main-grid">
        
        {/* Left Side: Voice Center and Controls */}
        <section className="lg:col-span-7 space-y-8 flex flex-col h-full" id="left-agent-console">
          
          {/* Voice Reactive Center Card */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-lg flex flex-col justify-between items-center text-center relative overflow-hidden shadow-2xl">
            <div className="w-full flex items-center justify-between mb-2">
              <div className="text-[10px] font-mono text-white/40 font-bold tracking-[0.2em] uppercase">
                Interactive Studio
              </div>
              {agentState !== "uninitialized" && (
                <button
                  onClick={handleStopAll}
                  className="text-[10px] font-bold text-white uppercase tracking-widest bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5 transition-all"
                  id="stop-agent-btn"
                >
                  <Square className="w-2.5 h-2.5 fill-white" />
                  <span>Stop Vocalizing</span>
                </button>
              )}
            </div>

            {/* Pulsing Voice Visualizer */}
            <VoiceVisualizer 
              state={agentState} 
              onToggleMic={handleToggleMic} 
              isContinuous={isContinuousMode}
            />

            {/* Immersive Italic Header Greeting */}
            <div className="mt-8 mb-4 text-center">
              <p className="text-xl md:text-2xl font-light italic text-white/90 leading-relaxed">
                "Hello I am Alexandra Ai agent, <br/>
                <span className="font-bold not-italic text-2xl md:text-3xl">how can I help you?</span>"
              </p>
              <p className="mt-4 text-white/40 text-[10px] uppercase tracking-[0.3em]">
                {agentState === "uninitialized" ? "Listening deactivated" : "Active & Speaking bilingual responses"}
              </p>
            </div>

            {/* Start conversation button */}
            {agentState === "uninitialized" && (
              <button
                onClick={initializeAgent}
                className="w-full mt-4 bg-white text-red-700 font-bold text-xs uppercase tracking-widest py-4 px-6 rounded-2xl shadow-xl hover:bg-white/95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                id="big-start-conversation-btn"
              >
                <Play className="w-3.5 h-3.5 fill-red-700 text-red-700" />
                <span>Initialize AI Conversation</span>
              </button>
            )}

            {agentState !== "uninitialized" && (
              <div className="w-full text-center mt-2 flex flex-col items-center gap-2">
                {!recognitionSupported && (
                  <div className="p-3 bg-red-950/40 text-rose-200 text-xs rounded-xl border border-white/5 flex items-start gap-2 text-left" id="speech-unsupported-alert">
                    <Info className="w-4 h-4 shrink-0 text-red-300 mt-0.5" />
                    <span>
                      Voice Input (Speech Recognition) is not supported in this environment yet. Feel free to interact bilingually with the keyboard console below.
                    </span>
                  </div>
                )}
                <div className="flex gap-4 text-xs font-semibold text-white/60 tracking-wider mt-2">
                  <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-all">
                    <input
                      type="checkbox"
                      checked={isContinuousMode}
                      onChange={(e) => setIsContinuousMode(e.target.checked)}
                      className="accent-white h-4 w-4 rounded-md border border-white/20 bg-transparent"
                    />
                    <span>HANDS-FREE LISTENING</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Dialog Log Card / Glass bubble */}
          <div className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-lg p-5 flex flex-col flex-1 min-h-[30rem] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <span className="text-[10px] font-bold text-white/60 uppercase tracking-[0.22em] font-mono">
                Transcription Dialog Log
              </span>
              <button
                onClick={handleClearHistory}
                disabled={messages.length === 0}
                className="text-white/40 hover:text-white disabled:opacity-20 transition-all cursor-pointer"
                id="clear-logs-btn"
                title="Clear Transcription Logs"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent" id="transcription-messages-scroller">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-white/40">
                  <Sparkles className="w-8 h-8 text-white/20 mb-3 animate-pulse" />
                  <p className="text-xs uppercase tracking-widest leading-relaxed">No dialogue active</p>
                  <button 
                    onClick={initializeAgent} 
                    className="text-xs font-bold text-white mt-2 underline hover:text-white/80 cursor-pointer uppercase tracking-wider"
                  >
                    Tap to trigger welcome hello
                  </button>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[85%] ${
                      msg.role === "assistant" ? "self-start items-start" : "self-end items-end ml-auto"
                    }`}
                  >
                    {/* Speaker name */}
                    <span className="text-[9px] font-mono font-bold text-white/40 mb-1 px-1 uppercase tracking-wider">
                      {msg.role === "assistant" ? "Alexandra AI Voice" : "Bilingual Guest"}
                    </span>
                    
                    {/* Bubble */}
                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed border ${
                        msg.role === "assistant"
                          ? "bg-white/5 border-white/5 text-white rounded-tl-none"
                          : "bg-white text-red-950 font-medium border-white rounded-tr-none shadow-md"
                      }`}
                    >
                      {msg.content}
                    </div>

                    {msg.role === "assistant" && (
                      <button
                        onClick={() => {
                          const isEng = !/[éèàùçâêîôûëïü]/.test(msg.content.toLowerCase()) || 
                                        msg.content.toLowerCase().includes("hello");
                          speakText(msg.content, isEng ? "en" : "fr");
                        }}
                        className="mt-1.5 flex items-center gap-1 text-[9px] uppercase tracking-wider text-white/75 bg-white/10 hover:bg-white/20 border border-white/5 px-2 py-1 rounded-lg transition-all"
                      >
                        <Volume2 className="w-3 h-3 text-red-300" />
                        <span>Replay Vocal</span>
                      </button>
                    )}
                  </div>
                ))
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Typing Backup Console */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(manualInput);
              }}
              className="mt-auto flex items-center gap-3 border-t border-white/10 pt-4"
            >
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="Ask her CV in english or in french (e.g. tell me about her experiences)..."
                className="flex-grow bg-white/5 border border-white/10 focus:border-white/25 p-3 rounded-2xl text-white placeholder-white/40 text-xs sm:text-sm focus:outline-none transition-all"
                id="manual-input-box"
              />
              <button
                type="submit"
                disabled={!manualInput.trim()}
                className="p-3 bg-white text-red-700 hover:scale-105 active:scale-95 disabled:scale-100 rounded-2xl disabled:bg-white/5 disabled:text-white/20 disabled:border-white/5 border border-white transition-all cursor-pointer shadow-lg"
                id="manual-submit-btn"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Advanced Synthesis Accent Selector */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-lg shadow-2xl" id="voice-settings-card">
            <h4 className="flex items-center gap-2 text-xs font-bold text-white/80 uppercase tracking-[0.2em] mb-4">
              <Settings className="w-4 h-4 text-red-300" />
              <span>Voice Accents Engine Mode</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* EN voice choose */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-white/50 block uppercase tracking-wider">English Synthesis Accent</label>
                <select
                  ref={selectEnVoiceRef}
                  value={selectedEnVoiceName}
                  onChange={(e) => setSelectedEnVoiceName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white text-[11px] p-2.5 rounded-xl font-mono focus:outline-none focus:border-white/20 select-option-dark"
                >
                  {enVoicesList.length === 0 ? (
                    <option value="">Default OS English Voice</option>
                  ) : (
                    enVoicesList.map((v) => (
                      <option key={v.name} value={v.name} className="text-red-950 bg-white">
                        {v.name} ({v.lang})
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* FR voice choose */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-white/50 block uppercase tracking-wider">French Synthesis Accent</label>
                <select
                  ref={selectFrVoiceRef}
                  value={selectedFrVoiceName}
                  onChange={(e) => setSelectedFrVoiceName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white text-[11px] p-2.5 rounded-xl font-mono focus:outline-none focus:border-white/20 select-option-dark"
                >
                  {frVoicesList.length === 0 ? (
                    <option value="">Default OS French Voice</option>
                  ) : (
                    frVoicesList.map((v) => (
                      <option key={v.name} value={v.name} className="text-red-950 bg-white">
                        {v.name} ({v.lang})
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>
            <p className="text-[10px] text-white/40 mt-3 font-normal leading-relaxed uppercase tracking-wider">
              Note: System TTS voices run directly in your environment. Google high fidelity accent profiles are prioritized.
            </p>
          </div>
          
        </section>

        {/* Right Side: Seamless Glass Resume Display (Col Span 5) */}
        <section className="lg:col-span-5 flex flex-col h-full" id="right-cv-display">
          <CvOverview data={cvLang === "en" ? cvDataEn : cvDataFr} lang={cvLang} />
        </section>

      </main>

      {/* Sleek Interface Footer */}
      <footer className="bg-red-800/40 border-t border-white/10 px-12 py-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono tracking-widest text-white/60">
        <div className="flex gap-6 uppercase">
          <button className="hover:text-white transition-colors duration-200 cursor-pointer">Bilingual companion</button>
          <span>•</span>
          <button className="hover:text-white transition-colors duration-200 cursor-pointer">Voice Synthesis</button>
        </div>
        <div className="flex flex-wrap gap-3">
           <div className="px-4 py-2 bg-white/5 rounded border border-white/10 text-[9px] uppercase tracking-wider">
             Output: Voice & Audio Replays
           </div>
           <div className="px-4 py-2 bg-white/5 rounded border border-white/10 text-[9px] uppercase tracking-wider">
             Engine: Gemini-3.5-flash
           </div>
        </div>
      </footer>
    </div>
  );
}

