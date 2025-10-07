import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import SecurityPrivacySection from "@/components/home/SecurityPrivacySection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <SecurityPrivacySection />
      <Footer />
    </div>
  );
};

export default Index;
