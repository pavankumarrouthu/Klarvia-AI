import { Shield, Users, Award } from "lucide-react";
import securityImage from "@/assets/security-privacy.jpg";

const SecurityPrivacySection = () => {
  return (
    <section className="py-20 px-6 bg-muted/20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your security and privacy is our top priority
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
            From data encryption to strict privacy governance, we continuously invest in
            robust safeguards so you can use Klarvia with complete confidence.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center p-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Unbreakable Data Encryption</h3>
            <p className="text-sm text-muted-foreground">
              All user data is encrypted in transit and at rest, using AES-256 encryption 
              for disk storage—the industry standard of data protection.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Privacy at Every Step</h3>
            <p className="text-sm text-muted-foreground">
              Klarvia protects your interactions with strict access controls and indexing 
              that respects original file permissions.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Certification You Can Count On</h3>
            <p className="text-sm text-muted-foreground">
              SOC2 compliance is a work in progress, with certification anticipated in 2025, 
              reinforcing our commitment to maintaining the highest security standards.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecurityPrivacySection;
