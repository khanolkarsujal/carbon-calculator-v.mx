import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, BarChart3 } from "lucide-react";
import StepIndicator from "./StepIndicator";
import type { TransportData, EnergyData, DietData, WasteData, LifestyleData } from "@/lib/carbon-calculations";

interface CalculatorFormProps {
  onCalculate: (
    transport: TransportData,
    energy: EnergyData,
    diet: DietData,
    waste: WasteData,
    lifestyle: LifestyleData
  ) => void;
}

const GlassSelect = ({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) => (
  <div>
    <label className="block text-sm font-medium text-muted-foreground mb-2">{label}</label>
    <select value={value} onChange={e => onChange(e.target.value)} className="w-full input-glass rounded-lg px-4 py-3 appearance-none cursor-pointer bg-secondary/30">
      {options.map(o => <option key={o.value} value={o.value} className="bg-card text-foreground">{o.label}</option>)}
    </select>
  </div>
);

const GlassInput = ({ label, value, onChange, unit, min = 0, max, step = 1 }: {
  label: string; value: number; onChange: (v: number) => void;
  unit: string; min?: number; max?: number; step?: number;
}) => (
  <div>
    <label className="block text-sm font-medium text-muted-foreground mb-2">{label}</label>
    <div className="relative">
      <input
        type="number" value={value} min={min} max={max} step={step}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full input-glass rounded-lg px-4 py-3 pr-16"
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{unit}</span>
    </div>
  </div>
);

const GlassSlider = ({ label, value, onChange, min = 0, max = 100, unit = "%" }: {
  label: string; value: number; onChange: (v: number) => void;
  min?: number; max?: number; unit?: string;
}) => (
  <div>
    <div className="flex justify-between mb-2">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      <span className="text-sm font-semibold text-primary">{value}{unit}</span>
    </div>
    <input
      type="range" min={min} max={max} value={value}
      onChange={e => onChange(Number(e.target.value))}
      className="w-full h-2 rounded-full appearance-none cursor-pointer bg-secondary accent-primary"
    />
  </div>
);

const CalculatorForm = ({ onCalculate }: CalculatorFormProps) => {
  const [step, setStep] = useState(0);

  const [transport, setTransport] = useState<TransportData>({
    carType: "car_petrol", carKmPerWeek: 100, publicTransitKmPerWeek: 30,
    publicTransitType: "bus", domesticFlightsPerYear: 2, internationalFlightsPerYear: 1, avgFlightHours: 4,
  });
  const [energy, setEnergy] = useState<EnergyData>({
    electricityKwhPerMonth: 300, energySource: "electricity_grid",
    heatingType: "natural_gas", heatingKwhPerMonth: 200, renewablePercentage: 10,
  });
  const [diet, setDiet] = useState<DietData>({
    dietType: "medium_meat", localFoodPercentage: 20, foodWastePercentage: 15,
  });
  const [waste, setWaste] = useState<WasteData>({
    wasteKgPerWeek: 8, recyclingPercentage: 30, compostingPercentage: 5,
  });
  const [lifestyle, setLifestyle] = useState<LifestyleData>({
    clothingSpendPerMonth: 100, electronicsSpendPerMonth: 50,
    waterLitersPerDay: 150, streamingHoursPerDay: 3,
  });

  const ut = (key: keyof TransportData, val: any) => setTransport(p => ({ ...p, [key]: val }));
  const ue = (key: keyof EnergyData, val: any) => setEnergy(p => ({ ...p, [key]: val }));
  const ud = (key: keyof DietData, val: any) => setDiet(p => ({ ...p, [key]: val }));
  const uw = (key: keyof WasteData, val: any) => setWaste(p => ({ ...p, [key]: val }));
  const ul = (key: keyof LifestyleData, val: any) => setLifestyle(p => ({ ...p, [key]: val }));

  const steps = [
    // Transport
    <div key="transport" className="space-y-5">
      <h3 className="text-xl font-display font-semibold text-foreground">🚗 Transportation</h3>
      <p className="text-sm text-muted-foreground">How do you get around? Your commute and travel habits matter.</p>
      <GlassSelect label="Primary Vehicle" value={transport.carType} onChange={v => ut("carType", v)} options={[
        { value: "car_petrol", label: "Petrol Car" }, { value: "car_diesel", label: "Diesel Car" },
        { value: "car_hybrid", label: "Hybrid Car" }, { value: "car_electric", label: "Electric Car" },
        { value: "motorcycle", label: "Motorcycle" }, { value: "bicycle", label: "Bicycle / None" },
      ]} />
      <GlassInput label="Weekly car distance" value={transport.carKmPerWeek} onChange={v => ut("carKmPerWeek", v)} unit="km/week" />
      <GlassSelect label="Public Transit Type" value={transport.publicTransitType} onChange={v => ut("publicTransitType", v)} options={[
        { value: "bus", label: "Bus" }, { value: "train", label: "Train" }, { value: "subway", label: "Metro/Subway" },
      ]} />
      <GlassInput label="Weekly public transit distance" value={transport.publicTransitKmPerWeek} onChange={v => ut("publicTransitKmPerWeek", v)} unit="km/week" />
      <div className="grid grid-cols-2 gap-4">
        <GlassInput label="Domestic flights/year" value={transport.domesticFlightsPerYear} onChange={v => ut("domesticFlightsPerYear", v)} unit="flights" />
        <GlassInput label="International flights/year" value={transport.internationalFlightsPerYear} onChange={v => ut("internationalFlightsPerYear", v)} unit="flights" />
      </div>
      <GlassInput label="Avg flight duration" value={transport.avgFlightHours} onChange={v => ut("avgFlightHours", v)} unit="hours" />
    </div>,

    // Energy
    <div key="energy" className="space-y-5">
      <h3 className="text-xl font-display font-semibold text-foreground">⚡ Energy Consumption</h3>
      <p className="text-sm text-muted-foreground">Your home energy usage is a significant part of your footprint.</p>
      <GlassInput label="Monthly electricity usage" value={energy.electricityKwhPerMonth} onChange={v => ue("electricityKwhPerMonth", v)} unit="kWh" />
      <GlassSelect label="Heating Source" value={energy.heatingType} onChange={v => ue("heatingType", v)} options={[
        { value: "natural_gas", label: "Natural Gas" }, { value: "heating_oil", label: "Heating Oil" },
        { value: "lpg", label: "LPG" }, { value: "electricity_grid", label: "Electric Heating" },
      ]} />
      <GlassInput label="Monthly heating usage" value={energy.heatingKwhPerMonth} onChange={v => ue("heatingKwhPerMonth", v)} unit="kWh" />
      <GlassSlider label="Renewable energy percentage" value={energy.renewablePercentage} onChange={v => ue("renewablePercentage", v)} />
    </div>,

    // Diet
    <div key="diet" className="space-y-5">
      <h3 className="text-xl font-display font-semibold text-foreground">🥗 Diet & Food</h3>
      <p className="text-sm text-muted-foreground">What you eat accounts for a major portion of personal emissions.</p>
      <GlassSelect label="Diet Type" value={diet.dietType} onChange={v => ud("dietType", v)} options={[
        { value: "heavy_meat", label: "Heavy Meat Eater (daily)" },
        { value: "medium_meat", label: "Medium Meat Eater (few/week)" },
        { value: "low_meat", label: "Low Meat Eater (once/week)" },
        { value: "pescatarian", label: "Pescatarian" },
        { value: "vegetarian", label: "Vegetarian" },
        { value: "vegan", label: "Vegan" },
      ]} />
      <GlassSlider label="Locally sourced food" value={diet.localFoodPercentage} onChange={v => ud("localFoodPercentage", v)} />
      <GlassSlider label="Food waste" value={diet.foodWastePercentage} onChange={v => ud("foodWastePercentage", v)} />
    </div>,

    // Waste
    <div key="waste" className="space-y-5">
      <h3 className="text-xl font-display font-semibold text-foreground">♻️ Waste Management</h3>
      <p className="text-sm text-muted-foreground">How you handle waste determines its environmental impact.</p>
      <GlassInput label="Weekly waste produced" value={waste.wasteKgPerWeek} onChange={v => uw("wasteKgPerWeek", v)} unit="kg/week" />
      <GlassSlider label="Recycling rate" value={waste.recyclingPercentage} onChange={v => uw("recyclingPercentage", v)} />
      <GlassSlider label="Composting rate" value={waste.compostingPercentage} onChange={v => uw("compostingPercentage", v)} />
      {waste.recyclingPercentage + waste.compostingPercentage > 100 && (
        <p className="text-sm text-destructive">⚠️ Recycling + composting can't exceed 100%</p>
      )}
    </div>,

    // Lifestyle
    <div key="lifestyle" className="space-y-5">
      <h3 className="text-xl font-display font-semibold text-foreground">🛍️ Lifestyle & Consumption</h3>
      <p className="text-sm text-muted-foreground">Your spending and daily habits also contribute to emissions.</p>
      <GlassInput label="Monthly clothing spend" value={lifestyle.clothingSpendPerMonth} onChange={v => ul("clothingSpendPerMonth", v)} unit="USD" />
      <GlassInput label="Monthly electronics spend" value={lifestyle.electronicsSpendPerMonth} onChange={v => ul("electronicsSpendPerMonth", v)} unit="USD" />
      <GlassInput label="Daily water usage" value={lifestyle.waterLitersPerDay} onChange={v => ul("waterLitersPerDay", v)} unit="liters" />
      <GlassInput label="Daily streaming time" value={lifestyle.streamingHoursPerDay} onChange={v => ul("streamingHoursPerDay", v)} unit="hours" />
    </div>,
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <StepIndicator currentStep={step} />
        <div className="glass glass-glow rounded-2xl p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              {steps[step]}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-8 pt-6 border-t border-border/30">
            <button
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg glass-subtle text-sm font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            {step < 4 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => onCalculate(transport, energy, diet, waste, lifestyle)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                <BarChart3 className="w-4 h-4" /> Calculate Results
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalculatorForm;
