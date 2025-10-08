import { Card } from "@/components/ui/card";
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
          <Card className="p-8 bg-gradient-to-br from-primary/5 via-primary/10 to-teal/5 border-primary/20 hover:border-primary/40 transition-smooth shadow-card hover:shadow-lg">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-teal p-1 overflow-hidden">
                <img 
                  src={securityImage} 
                  alt="Data Encryption" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
              <h3 className="text-xl font-semibold">Unbreakable Data Encryption</h3>
              <p className="text-sm text-muted-foreground">
                All user data is encrypted in transit and at rest, using AES-256 encryption 
                for disk storage—the industry standard of data protection.
              </p>
            </div>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-teal/5 via-accent/10 to-primary/5 border-teal/20 hover:border-teal/40 transition-smooth shadow-card hover:shadow-lg">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-teal to-accent p-1 overflow-hidden">
                <img 
                  src={securityImage} 
                  alt="Privacy Protection" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
              <h3 className="text-xl font-semibold">Privacy at Every Step</h3>
              <p className="text-sm text-muted-foreground">
                Klarvia protects your interactions with strict access controls and indexing 
                that respects original file permissions.
              </p>
            </div>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-accent/5 via-teal/10 to-primary/5 border-accent/20 hover:border-accent/40 transition-smooth shadow-card hover:shadow-lg">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-accent to-primary p-1 overflow-hidden">
                <img 
                  src={securityImage} 
                  alt="Security Certification" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
              <h3 className="text-xl font-semibold">Certification You Can Count On</h3>
              <p className="text-sm text-muted-foreground">
                SOC2 compliance is a work in progress, with certification anticipated in 2025, 
                reinforcing our commitment to maintaining the highest security standards.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SecurityPrivacySection;
