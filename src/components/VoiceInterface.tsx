"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Volume2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VoiceInterface() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const toggleInterface = () => setIsOpen(!isOpen);
  const closeInterface = () => setIsOpen(false);

  const handleMicClick = () => {
    setIsListening(!isListening);
    // Future: integrate microphone recognition here
  };

  return (
    <div className="relative">
      {/* Main Trigger Button */}
      <Button
        onClick={toggleInterface}
        className="fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl"
      >
        <Mic size={28} />
      </Button>

      {/* Voice Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeInterface}
          >
            {/* Centered Modal Card */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-10 mx-auto flex flex-col items-center justify-center relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeInterface}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>

              {/* Header */}
              <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
                🎙️ Voice Interaction
              </h2>

              {/* Two Cards Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                {/* USER CARD */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 shadow-md flex flex-col items-center justify-center text-center"
                >
                  <h3 className="text-lg font-semibold text-indigo-700 mb-4">
                    User Voice Input
                  </h3>

                  <div className="flex flex-col items-center justify-center space-y-4">
                    <Button
                      onClick={handleMicClick}
                      className={`w-14 h-14 rounded-full flex items-center justify-center ${
                        isListening
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-indigo-600 hover:bg-indigo-700"
                      } text-white shadow-lg transition-all`}
                    >
                      <Mic size={24} />
                    </Button>

                    <p className="text-gray-600">
                      {isListening
                        ? "Listening..."
                        : "Tap to start recording your voice"}
                    </p>
                  </div>
                </motion.div>

                {/* AI CARD */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-md flex flex-col items-center justify-center text-center"
                >
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    AI Voice Output
                  </h3>

                  <div className="flex flex-col items-center justify-center space-y-4">
                    <Button
                      disabled
                      className="w-14 h-14 rounded-full bg-gray-400 text-white flex items-center justify-center cursor-not-allowed"
                    >
                      <Volume2 size={24} />
                    </Button>
                    <p className="text-gray-600">
                      The AI will respond here with speech output.
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
