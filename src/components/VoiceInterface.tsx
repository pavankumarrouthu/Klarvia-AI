import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, X, Volume2 } from "lucide-react";

// Temporary typing for experimental Web Speech API
type SpeechRecognition = any;

// CSS-based animated orb to avoid React 19 reconciler requirements
function CssEnergyOrb({ intensity }: { intensity: number }) {
  const blur = 20 + intensity * 20;
  const scale = 1 + intensity * 0.1;
  const opacity = 0.75 + intensity * 0.15;
  return (
    <div className="relative w-full h-full">
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(closest-side, rgba(24,173,188,0.7), rgba(99,102,241,0.25) 60%, transparent 70%)",
          filter: `blur(${blur}px)`
        }}
        animate={{ rotate: [0, 360], scale, opacity }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "conic-gradient(from 90deg at 50% 50%, rgba(24,173,188,0.3), rgba(99,102,241,0.3), rgba(24,173,188,0.3))"
        }}
        animate={{ rotate: [360, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute inset-0 bg-white/20 rounded-xl mix-blend-overlay" />
    </div>
  );
}

const VoiceInterface = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const recognitionRef = useRef<any | null>(null);

  useEffect(() => {
    // Simplified voice recognition setup
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      try {
        recognitionRef.current = new (window as any).webkitSpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onstart = () => {
          setIsListening(true);
          setIsProcessing(false);
        };

        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          setTranscript(finalTranscript);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
          setIsProcessing(true);
          // Simulate AI response
          setTimeout(() => {
            setResponse("I understand you're feeling overwhelmed. Let's take a moment to breathe together. Would you like to try a quick mindfulness exercise?");
            setIsProcessing(false);
          }, 2000);
        };

        recognitionRef.current.onerror = () => {
          setIsListening(false);
          setIsProcessing(false);
        };
      } catch (error) {
        console.log('Speech recognition not available:', error);
      }
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscript("");
      setResponse("");
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const closeInterface = () => {
    setIsOpen(false);
    setIsListening(false);
    setIsProcessing(false);
    setTranscript("");
    setResponse("");
  };

  return (
    <>
      {/* Floating Voice Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-gradient-to-r from-[#18ADBC] to-[#6366F1] rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-all duration-300"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <Mic className="w-6 h-6" />
        </motion.div>
      </motion.button>

      {/* Voice Interface Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeInterface}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#18ADBC] to-[#6366F1] rounded-full flex items-center justify-center">
                    <Mic className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Need a moment?</h3>
                    <p className="text-sm text-gray-500">Klarvia's here to listen</p>
                  </div>
                </div>
                <button
                  onClick={closeInterface}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Voice Interface */}
              <div className="space-y-6">
                {/* Visual */}
                <div className="h-64 rounded-xl overflow-hidden bg-gradient-to-br from-[#18ADBC]/10 to-[#6366F1]/10 border border-white/40 shadow-inner">
                  <CssEnergyOrb intensity={isListening ? 0.8 : isProcessing ? 0.5 : 0.2} />
                </div>
                {/* Listening State */}
                <div className="text-center">
                  <motion.div
                    className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-[#18ADBC] to-[#6366F1] rounded-full flex items-center justify-center"
                    animate={isListening ? {
                      scale: [1, 1.1, 1],
                    } : {}}
                    transition={{
                      duration: 1,
                      repeat: isListening ? Infinity : 0,
                      ease: "easeInOut"
                    }}
                  >
                    {isListening ? (
                      <Mic className="w-8 h-8 text-white" />
                    ) : (
                      <MicOff className="w-8 h-8 text-white" />
                    )}
                  </motion.div>
                  
                  <p className="text-gray-600 mb-4">
                    {isListening ? "Listening..." : isProcessing ? "Processing..." : "Tap to start talking"}
                  </p>

                  {!isListening && !isProcessing && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={startListening}
                      className="bg-gradient-to-r from-[#18ADBC] to-[#6366F1] text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Start Talking
                    </motion.button>
                  )}

                  {isListening && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={stopListening}
                      className="bg-red-500 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Stop Listening
                    </motion.button>
                  )}
                </div>

                {/* Transcript */}
                {transcript && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/70 rounded-2xl p-4 shadow-lg border border-gray-200"
                  >
                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">You said</p>
                    <p className="text-gray-900 leading-relaxed">{transcript}</p>
                  </motion.div>
                )}

                {/* AI Response */}
                {response && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-[#18ADBC]/10 to-[#6366F1]/10 rounded-2xl p-4 shadow-lg border border-white/40"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-[#18ADBC] to-[#6366F1] rounded-full flex items-center justify-center flex-shrink-0">
                        <Volume2 className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Klarvia responds</p>
                        <p className="text-gray-900 leading-relaxed">{response}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Processing Animation */}
                {isProcessing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                  >
                    <div className="flex justify-center space-x-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-[#18ADBC] rounded-full"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.2
                          }}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Klarvia is thinking...</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VoiceInterface;
