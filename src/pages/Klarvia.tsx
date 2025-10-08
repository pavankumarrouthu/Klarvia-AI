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
      <div className="relative z-10">
        <Navbar />
        
        {/* Meet Klarvia Section */}
        <div className="pt-20 min-h-screen flex items-center">
          {!loading && !user ? (
            <div className="container mx-auto px-6 py-20 text-center">
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                Sign in to start your conversation with Klarvia
              </motion.h2>
              <motion.p
                className="text-muted-foreground mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
              >
                Create an account or log in to access your personal AI companion for workplace wellbeing.
              </motion.p>
              <div className="flex gap-4 justify-center">
                <Link to="/">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <KlarviaSectionUpdated />
          )}
        </div>
        
        {/* How It Works Section */}
        <section className="py-20 px-6 bg-muted/30 border-t border-border">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <motion.h2
                className="text-2xl md:text-4xl font-bold mb-3"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                How It Works
              </motion.h2>
              <motion.p
                className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              >
                Simple steps to get started with Klarvia and improve your workplace wellbeing
              </motion.p>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-10">
              <motion.div
                className="flex gap-5 items-start"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold">
                  1
                </div>
                <div>
                  <motion.h3 className="text-lg font-semibold mb-2" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 }}>Start a Conversation</motion.h3>
                  <motion.p className="text-sm text-muted-foreground" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.2 }}>
                    Simply speak to Klarvia about what's on your mind. No typing, no forms - just natural conversation.
                  </motion.p>
                </div>
              </motion.div>
              
              <motion.div
                className="flex gap-5 items-start"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold">
                  2
                </div>
                <div>
                  <motion.h3 className="text-lg font-semibold mb-2" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 }}>Get Personalized Support</motion.h3>
                  <motion.p className="text-sm text-muted-foreground" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.2 }}>
                    Klarvia listens without judgment, helps you process emotions, and provides tailored insights based on your unique work situation.
                  </motion.p>
                </div>
              </motion.div>
              
              <motion.div
                className="flex gap-5 items-start"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold">
                  3
                </div>
                <div>
                  <motion.h3 className="text-lg font-semibold mb-2" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 }}>Track Your Progress</motion.h3>
                  <motion.p className="text-sm text-muted-foreground" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.2 }}>
                    View your wellbeing trends, stress patterns, and see how you're improving over time with actionable insights.
                  </motion.p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Footer Section */}
        <Footer />
      </div>
    </div>
  );
};

export default Klarvia;
