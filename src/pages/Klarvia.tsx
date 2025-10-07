import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import KlarviaSectionUpdated from "@/components/home/KlarviaSectionUpdated";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Sign in to start your conversation with Klarvia
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Create an account or log in to access your personal AI companion for workplace wellbeing.
              </p>
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
              <h2 className="text-2xl md:text-4xl font-bold mb-3">
                How It Works
              </h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
                Simple steps to get started with Klarvia and improve your workplace wellbeing
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-10">
              <div className="flex gap-5 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Start a Conversation</h3>
                  <p className="text-sm text-muted-foreground">
                    Simply speak to Klarvia about what's on your mind. No typing, no forms - just natural conversation.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-5 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Get Personalized Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Klarvia listens without judgment, helps you process emotions, and provides tailored insights based on your unique work situation.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-5 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Track Your Progress</h3>
                  <p className="text-sm text-muted-foreground">
                    View your wellbeing trends, stress patterns, and see how you're improving over time with actionable insights.
                  </p>
                </div>
              </div>
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
