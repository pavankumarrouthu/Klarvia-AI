import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import workdayOverload from "@/assets/features/workday-overload-new.jpg";
import privacy from "@/assets/features/privacy-new.jpg";
import rhythm from "@/assets/features/rhythm-new.jpg";
import insights from "@/assets/features/insights-new.jpg";
import hrAlly from "@/assets/features/hr-ally-new.jpg";
import stigmaFree from "@/assets/features/stigma-free-new.jpg";

const features = [
  {
    title: "Beat Workday Overload",
    description: "Deadlines, back-to-back calls, chaos? Klarvia helps you reset, refocus, and power through — without burning out.",
    image: workdayOverload,
  },
  {
    title: "Stress that Stays Private",
    description: "Your chai breaks may be public, but your thoughts aren't. Klarvia keeps every word encrypted and confidential.",
    image: privacy,
  },
  {
    title: "Learns Your Rhythm",
    description: "Morning hustler or midnight thinker? Klarvia adapts to your work style, giving nudges when you need them most.",
    image: rhythm,
  },
  {
    title: "Insights that Matter",
    description: "Not just feel-good chats — Klarvia shows stress markers, session snapshots, and how your wellbeing evolves over time.",
    image: insights,
  },
  {
    title: "HR's Secret Ally",
    description: "Works hand-in-hand with HR & psychologists, so employees don't just cope — they thrive.",
    image: hrAlly,
  },
  {
    title: "Mental Health, Without the Labels",
    description: "No heavy jargon, no awkwardness. Klarvia keeps it light, stigma-free, and easy for everyone to open up.",
    image: stigmaFree,
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-16 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Why Klarvia?
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="shadow-soft border border-border hover:shadow-card transition-smooth overflow-hidden flex flex-col h-[320px]"
            >
              <div className="h-40 w-full overflow-hidden flex-shrink-0">
                <img 
                  src={feature.image} 
                  alt={feature.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
