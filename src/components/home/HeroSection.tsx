import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroBackground from "@/assets/hero-background.jpg";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background/90" />
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">
            It's not therapy.<br />
            It's workplace<br />
            clarity.
          </h1>
          
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Klarvia's AI voice bots give your team a safe, stigma-free space to explore emotions and stay mentally strong at work.
          </p>
          
          <Button 
            size="lg"
            className="bg-gradient-to-r from-teal to-primary hover:from-teal/90 hover:to-primary/90 text-primary-foreground transition-smooth px-10 py-5 text-sm shadow-lg"
            onClick={() => navigate('/klarvia')}
          >
            Meet Klarvia
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
