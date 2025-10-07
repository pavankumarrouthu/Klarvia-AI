import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import KlarviaSectionUpdated from "@/components/home/KlarviaSectionUpdated";

const Klarvia = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/10 to-background">
      <Navbar />
      <div className="pt-20">
        <KlarviaSectionUpdated />
        
        {/* How It Works Section */}
        <section className="py-16 px-6 bg-muted/20">
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
      </div>
      <Footer />
    </div>
  );
};

export default Klarvia;
