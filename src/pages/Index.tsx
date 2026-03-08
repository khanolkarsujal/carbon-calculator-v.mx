import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import EducationSection from "@/components/EducationSection";
import GlobalEmissionsTimeline from "@/components/GlobalEmissionsTimeline";
import CalculatorForm from "@/components/CalculatorForm";
import ResultsDashboard from "@/components/ResultsDashboard";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { calculateTotal, type TransportData, type EnergyData, type DietData, type WasteData, type LifestyleData, type CarbonResults } from "@/lib/carbon-calculations";

const Index = () => {
  const [view, setView] = useState<"hero" | "calculator" | "results">("hero");
  const [results, setResults] = useState<CarbonResults | null>(null);
  const calcRef = useRef<HTMLDivElement>(null);

  const handleStart = () => {
    setView("calculator");
    setTimeout(() => calcRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const handleCalculate = (
    transport: TransportData,
    energy: EnergyData,
    diet: DietData,
    waste: WasteData,
    lifestyle: LifestyleData
  ) => {
    const r = calculateTotal(transport, energy, diet, waste, lifestyle);
    setResults(r);
    setView("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setResults(null);
    setView("hero");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/30 selection:text-primary-foreground">
      {/* Dynamic Background Effects */}
      <BackgroundEffects />

      <AnimatePresence mode="wait">
        {view === "hero" && (
          <motion.div key="hero" exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <HeroSection onStart={handleStart} />
            <EducationSection />
            <GlobalEmissionsTimeline />

            {/* Final CTA */}
            <section className="py-20 px-4 relative z-10 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                  <span className="text-foreground">Ready to </span>
                  <span className="text-gradient glow-text">Know Your Impact?</span>
                </h2>
                <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                  Use our precision calculator to measure your personal carbon footprint and get actionable tips.
                </p>
                <button
                  onClick={handleStart}
                  className="group relative px-8 py-4 rounded-xl font-display font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-primary rounded-xl" />
                  <div className="absolute inset-0 bg-accent/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative text-primary-foreground">Calculate My Footprint</span>
                </button>
              </motion.div>
            </section>
          </motion.div>
        )}

        {view === "calculator" && (
          <motion.div
            key="calculator"
            ref={calcRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            <div className="pt-8 px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gradient mb-2">
                Calculate Your Footprint
              </h2>
              <p className="text-muted-foreground">Complete all 5 categories for accurate results</p>
            </div>
            <CalculatorForm onCalculate={handleCalculate} />
          </motion.div>
        )}

        {view === "results" && results && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            <ResultsDashboard results={results} onReset={handleReset} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
