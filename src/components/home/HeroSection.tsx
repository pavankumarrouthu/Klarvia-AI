import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mic, Zap } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden">
      {/* Background image */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-center bg-cover"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      {/* Soft white overlay to match dim effect */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-white/90" />
      {/* Animated Gradient Overlay */}
      <motion.div 
        className="absolute inset-0 -z-10 bg-gradient-to-br from-[#18ADBC]/10 via-transparent to-[#E8EAF6]/20"
        animate={{
          background: [
            "linear-gradient(135deg, #18ADBC/10 0%, transparent 50%, #E8EAF6/20 100%)",
            "linear-gradient(135deg, #E8EAF6/20 0%, transparent 50%, #18ADBC/10 100%)",
            "linear-gradient(135deg, #18ADBC/10 0%, transparent 50%, #E8EAF6/20 100%)"
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Main Headline with Animation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-gray-900">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="block"
              >
                Chill, boss.
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="block text-[#18ADBC]"
              >
                Klarvia's here.
              </motion.span>
            </h1>
          </motion.div>
          
          {/* Subtext with Staggered Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-4"
          >
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto font-medium">
              When deadlines pile up, Klarvia helps you breathe easy and take charge.
            </p>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
              For every chai break, every deadline.
            </p>
          </motion.div>
          
          {/* CTA Button with Hover Effects */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Button 
              size="lg"
              className="bg-gradient-to-r from-[#18ADBC] to-[#6366F1] hover:from-[#18ADBC]/90 hover:to-[#6366F1]/90 text-white transition-all duration-300 px-12 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl hover:scale-105 rounded-full"
              onClick={() => navigate('/klarvia')}
            >
              <Zap className="w-5 h-5 mr-2" />
              Try Klarvia Free
            </Button>
          </motion.div>

          {/* Floating Microphone Icon Hint */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="absolute bottom-8 right-8"
          >
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-[#18ADBC]/20"
            >
              <Mic className="w-6 h-6 text-[#18ADBC]" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
