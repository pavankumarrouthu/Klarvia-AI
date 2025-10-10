"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Klarvia() {
  return (
    <section className="min-h-[calc(100vh-80px)] flex items-center justify-center py-16 px-6 bg-gradient-to-b from-indigo-50 to-white">
      <div className="container mx-auto text-center flex flex-col items-center justify-center space-y-8">
        {/* Header */}
        <motion.h2
          className="text-3xl md:text-5xl font-bold text-indigo-700 mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Meet Klarvia
        </motion.h2>

        <motion.p
          className="text-gray-600 mb-6 max-w-2xl mx-auto text-lg"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        >
          Have a natural voice conversation with Klarvia, your AI companion for
          workplace wellbeing.
        </motion.p>

        {/* Two Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          {/* Klarvia Card */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-indigo-100 flex flex-col items-center justify-center"
          >
            <img
              src="/ai-avatar.png"
              alt="Klarvia"
              className="w-20 h-20 rounded-full mb-4"
            />
            <h3 className="text-xl font-semibold text-indigo-700">Klarvia</h3>
            <p className="text-gray-500 text-sm mt-2">Listening...</p>
          </motion.div>

          {/* User Card */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center justify-center"
          >
            <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#6b21a8"
                className="w-10 h-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 7.5V9A3.75 3.75 0 0112 12.75H9.75A3.75 3.75 0 016 9V7.5M12 12.75V21M12 21a4.5 4.5 0 004.5-4.5H7.5A4.5 4.5 0 0012 21z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-indigo-700">You</h3>
            <p className="text-gray-500 text-sm mt-2">Ready</p>
          </motion.div>
        </div>

        {/* Start Button */}
        <Button className="mt-10 px-8 py-3 text-lg bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-xl transition-all">
          Start
        </Button>
      </div>
    </section>
  );
}
