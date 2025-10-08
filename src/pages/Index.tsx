import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import SecurityPrivacySection from "@/components/home/SecurityPrivacySection";
import VoiceInterface from "@/components/VoiceInterface";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <SecurityPrivacySection />
      <Footer />
      <VoiceInterface />
    </div>
  );
};

export default Index;
