import { Shield, Lock, Award } from "lucide-react";
import { motion } from "framer-motion";

const SecurityPrivacySection = () => {
  const securityFeatures = [
    {
      icon: Shield,
      title: "Unbreakable Data Encryption",
      description: "All user data is encrypted in transit and at rest, using AES-256 encryption for disk storage—the industry standard of data protection.",
      color: "#18ADBC",
      bgGradient: "from-blue-50 to-indigo-50"
    },
    {
      icon: Lock,
      title: "Privacy at Every Step",
      description: "Your wellbeing data never leaves your workspace. Klarvia protects your interactions with strict access controls and zero-knowledge architecture.",
      color: "#10B981",
      bgGradient: "from-green-50 to-emerald-50"
    },
    {
      icon: Award,
      title: "Certification You Can Count On",
      description: "SOC2 compliance is a work in progress, with certification anticipated in 2025, reinforcing our commitment to maintaining the highest security standards.",
      color: "#8B5CF6",
      bgGradient: "from-purple-50 to-violet-50"
    }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-[#F8F9FF] to-[#E8EAF6]">
      <div className="container mx-auto max-w-7xl">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
            Your wellbeing data never leaves your workspace
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            From data encryption to strict privacy governance, we continuously invest in robust safeguards so you can use Klarvia with complete confidence.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {securityFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-gray-100">

                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-30`} />
                
                <div className="relative z-10 text-center">
                  <motion.div
                    className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: feature.color + '20' }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <feature.icon className="h-10 w-10" style={{ color: feature.color }} />
                  </motion.div>
                  
                  <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-[#18ADBC] transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Hover Effect Overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-[#18ADBC]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div 
          className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-[#18ADBC]/20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Trusted by forward-thinking organizations
            </h3>
            <p className="text-gray-600">
              Join companies that prioritize employee wellbeing and data security
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "AES-256 Encryption", value: "100%" },
              { label: "Zero-Knowledge Architecture", value: "✓" },
              { label: "SOC2 Compliance", value: "2025" },
              { label: "Data Residency", value: "Your Region" }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center p-4 bg-white/50 rounded-xl"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-2xl font-bold text-[#18ADBC] mb-2">{item.value}</div>
                <div className="text-sm text-gray-600">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SecurityPrivacySection;
