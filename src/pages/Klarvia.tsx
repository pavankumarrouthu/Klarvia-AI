import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import KlarviaSectionUpdated from "@/components/home/KlarviaSectionUpdated";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Klarvia = () => {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Video Background */}
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

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        {/* Meet Klarvia Section - Centered */}
        <div className="flex-grow flex items-center justify-center">
          {!loading && !user ? (
            <div className="text-center max-w-4xl mx-auto px-6 py-10">
              <motion.h2
                className="text-4xl md:text-5xl font-bold mb-6 text-primary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                Meet Klarvia
              </motion.h2>

              <motion.p
                className="text-muted-foreground mb-10 max-w-2xl mx-auto text-lg md:text-xl"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
              >
                Have a natural voice conversation with Klarvia, your AI companion for workplace wellbeing.
              </motion.p>

              {/* Two Cards */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-10 mb-10">
                {/* AI Card */}
                <motion.div
                  className="w-72 h-72 bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200 flex flex-col items-center justify-center space-y-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <img
                    src="/ai-avatar.png"
                    alt="Klarvia"
                    className="w-28 h-28 rounded-full border-4 border-primary/30"
                  />
                  <h3 className="text-2xl font-semibold text-primary">Klarvia</h3>
                  <p className="text-gray-500 text-base">Listening...</p>
                </motion.div>

                {/* User Card */}
                <motion.div
                  className="w-72 h-72 bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200 flex flex-col items-center justify-center space-y-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                >
                  <div className="w-28 h-28 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-12 h-12 text-primary"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 7.5V9A3.75 3.75 0 0112 12.75H9.75A3.75 3.75 0 016 9V7.5M12 12.75V21M12 21a4.5 4.5 0 004.5-4.5H7.5A4.5 4.5 0 0012 21z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-primary">You</h3>
                  <p className="text-gray-500 text-base">Ready</p>
                </motion.div>
              </div>

              {/* Start Button */}
              <Link to="/">
                <Button
                  size="lg"
                  className="px-10 py-5 text-lg bg-primary hover:bg-primary/90 rounded-full shadow-lg"
                >
                  Start
                </Button>
              </Link>

              <p className="text-sm text-gray-500 mt-6">
                Click Start to begin your voice conversation with Klarvia.
              </p>
            </div>
          ) : (
            <KlarviaSectionUpdated />
          )}
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Klarvia;
