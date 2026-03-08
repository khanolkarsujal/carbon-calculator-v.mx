import { motion } from "framer-motion";
import { Leaf, ArrowDown } from "lucide-react";
import heroForest from "@/assets/hero-forest.jpg";

interface HeroSectionProps {
  onStart: () => void;
}

const HeroSection = ({ onStart }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={heroForest} alt="Misty forest canopy" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/70" />
        <div className="absolute inset-0 smoke-effect" />
      </div>

      {/* Animated orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl"
        animate={{ x: [0, 30, -20, 0], y: [0, -20, 10, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-accent/5 blur-3xl"
        animate={{ x: [0, -20, 30, 0], y: [0, 15, -25, 0], scale: [1, 0.95, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2 glass-subtle rounded-full px-4 py-2 mb-8">
            <Leaf className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground font-medium">Carbon Footprint Calculator</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 leading-tight"
        >
          <span className="text-gradient glow-text">Measure.</span>
          <br />
          <span className="text-foreground">Understand.</span>
          <br />
          <span className="text-gradient glow-text">Act.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Discover your environmental impact with our precision carbon calculator.
          Backed by scientific emission factors, visualize your footprint and take meaningful action.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={onStart}
            className="group relative px-8 py-4 rounded-xl font-display font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-105"
          >
            <div className="absolute inset-0 bg-primary rounded-xl" />
            <div className="absolute inset-0 bg-accent/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative text-primary-foreground">Calculate My Footprint</span>
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-16"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowDown className="w-6 h-6 text-muted-foreground mx-auto" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
