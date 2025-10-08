import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { 
  Zap, 
  Shield, 
  Clock, 
  BarChart3, 
  Users, 
  Heart
} from "lucide-react";

const features = [
  {
    title: "Beat Workday Overload",
    description: "Deadlines, back-to-back calls, chaos? Klarvia helps you reset, refocus, and power through — without burning out.",
    icon: "zap",
    color: "#18ADBC",
    bgGradient: "from-orange-50 to-red-50",
    icon3D: "zap"
  },
  {
    title: "Stress that Stays Private",
    description: "Your chai breaks may be public, but your thoughts aren't. Klarvia keeps every word encrypted and confidential.",
    icon: "shield",
    color: "#10B981",
    bgGradient: "from-green-50 to-emerald-50",
    icon3D: "shield"
  },
  {
    title: "Learns Your Rhythm",
    description: "Morning hustler or midnight thinker? Klarvia adapts to your work style, giving nudges when you need them most.",
    icon: "clock",
    color: "#8B5CF6",
    bgGradient: "from-purple-50 to-violet-50",
    icon3D: "clock"
  },
  {
    title: "Insights that Matter",
    description: "Not just feel-good chats — Klarvia shows stress markers, session snapshots, and how your wellbeing evolves over time.",
    icon: "chart",
    color: "#F59E0B",
    bgGradient: "from-yellow-50 to-amber-50",
    icon3D: "chart"
  },
  {
    title: "HR's Secret Ally",
    description: "Works hand-in-hand with HR & psychologists, so employees don't just cope — they thrive.",
    icon: "users",
    color: "#EF4444",
    bgGradient: "from-red-50 to-pink-50",
    icon3D: "users"
  },
  {
    title: "Mental Health, Without the Labels",
    description: "No heavy jargon, no awkwardness. Klarvia keeps it light, stigma-free, and easy for everyone to open up.",
    icon: "heart",
    color: "#EC4899",
    bgGradient: "from-pink-50 to-rose-50",
    icon3D: "heart"
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-[#FAFAFA] to-[#F8F9FF]">
      <div className="container mx-auto max-w-7xl">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
            Your organization's quiet powerhouse for workplace wellbeing
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Blending psychology, AI, and behavioral insights to help employees breathe easier, focus better, and perform sustainably.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="group relative overflow-hidden h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105">

                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-50`} />
                
                <CardHeader className="relative z-10 pb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: feature.color + '20' }}
                    >
                      {feature.icon === 'zap' && <Zap className="w-6 h-6" style={{ color: feature.color }} />}
                      {feature.icon === 'shield' && <Shield className="w-6 h-6" style={{ color: feature.color }} />}
                      {feature.icon === 'clock' && <Clock className="w-6 h-6" style={{ color: feature.color }} />}
                      {feature.icon === 'chart' && <BarChart3 className="w-6 h-6" style={{ color: feature.color }} />}
                      {feature.icon === 'users' && <Users className="w-6 h-6" style={{ color: feature.color }} />}
                      {feature.icon === 'heart' && <Heart className="w-6 h-6" style={{ color: feature.color }} />}
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-[#18ADBC] transition-colors duration-300">
                      {feature.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                
                <CardContent className="relative z-10">
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {/* Additional visual elements */}
                  <div className="mt-6 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: feature.color }} />
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                  </div>
                </CardContent>

                {/* Hover Effect Overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-[#18ADBC]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-[#18ADBC]/20">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to transform your workplace wellbeing?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Book a live demo for your HR team and see how Klarvia can help your employees thrive.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-[#18ADBC] to-[#6366F1] text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Book a Live Demo
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
