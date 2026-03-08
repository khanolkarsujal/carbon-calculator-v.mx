import { motion } from "framer-motion";
import { Check, Car, Zap, Utensils, Trash2, ShoppingBag } from "lucide-react";

const STEPS = [
  { label: "Transport", icon: Car },
  { label: "Energy", icon: Zap },
  { label: "Diet", icon: Utensils },
  { label: "Waste", icon: Trash2 },
  { label: "Lifestyle", icon: ShoppingBag },
];

interface StepIndicatorProps {
  currentStep: number;
}

const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center gap-2 md:gap-4 mb-8 flex-wrap">
      {STEPS.map((step, index) => {
        const Icon = step.icon;
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        return (
          <div key={step.label} className="flex items-center gap-2">
            <motion.div
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive ? "step-active" : isCompleted ? "step-completed" : "step-inactive"
              }`}
              animate={isActive ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              <span className="hidden sm:inline">{step.label}</span>
            </motion.div>
            {index < STEPS.length - 1 && (
              <div className={`w-6 h-px ${isCompleted ? "bg-primary/60" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;
