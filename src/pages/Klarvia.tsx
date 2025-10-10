"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import VoiceInterface from "@/components/home/VoiceInterface";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

export default function Klarvia() {
  const { user, loading } = useAuth();
  const [showVoiceInterface, setShowVoiceInterface] = useState(false);

  const handleStart = () => {
    setShowVoiceInterface(true);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* 🔹 Background Video */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-20"
        >
          <source src="/background-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/80" />
      </div>

      {/* 🔹 Foreground Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <div className="flex-grow flex items-center justify-center px-4">
          {!loading && !showVoiceInterface ? (
            <div className="text-center max-w-5xl mx-auto px-6 py-12">
              {/* Title */}
              <motion.h2
                className="text-5xl md:text-6xl font-bold mb-6 text-primary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Meet Klarvia
              </motion.h2>

              {/* Subtitle */}
              <motion.p
                className="text-muted-foreground mb-10 max-w-2xl mx-auto text-lg md:text-xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
                Have a natural voice conversation with Klarvia — your AI
                companion for workplace wellbeing.
              </motion.p>

              {/* Cards Container */}
              <motion.div
                className="flex flex-col md:flex-row items-center justify-center gap-10 mb-12"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {/* User Card */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-80 h-80 bg-indigo-50 border border-indigo-200 rounded-2xl shadow-xl p-6 flex flex-col items-center justify-center space-y-4"
                >
                  <div className="bg-indigo-600 text-white w-20 h-20 rounded-full flex items-center justify-center shadow-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-10 h-10"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 18.75a6.75 6.75 0 006.75-6.75M5.25 12A6.75 6.75 0 0112 5.25M12 18.75V21m0-15.75V3"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-indigo-700">
                    Your Voice
                  </h3>
                  <p className="text-gray-500 text-base">
                    Tap the mic to start speaking
                  </p>
                </motion.div>

                {/* AI Card */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-80 h-80 bg-gray-50 border border-gray-200 rounded-2xl shadow-xl p-6 flex flex-col items-center justify-center space-y-4"
                >
                  <div className="bg-gray-400 text-white w-20 h-20 rounded-full flex items-center justify-center shadow-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-10 h-10"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 9l10.5 3L9 15V9z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-700">
                    Klarvia’s Response
                  </h3>
                  <p className="text-gray-500 text-base">
                    Klarvia will respond right after you speak.
                  </p>
                </motion.div>
              </motion.div>

              {/* Start Button */}
              <div className="flex flex-col items-center space-y-4">
                <Button
                  onClick={handleStart}
                  size="lg"
                  className="px-10 py-5 text-lg bg-primary hover:bg-primary/90 rounded-full shadow-lg"
                >
                  Start Conversation
                </Button>
                <p className="text-sm text-gray-500">
                  Click Start to open Klarvia’s voice interface.
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full flex items-center justify-center">
              {/* 🧠 Integrated Voice Interface (centered modal) */}
              <VoiceInterface />
            </div>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
}
