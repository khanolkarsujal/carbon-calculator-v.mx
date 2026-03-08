// Carbon emission factors (kg CO2e per unit)
export const EMISSION_FACTORS = {
  // Transportation (kg CO2 per km)
  transport: {
    car_petrol: 0.192,
    car_diesel: 0.171,
    car_hybrid: 0.109,
    car_electric: 0.053,
    motorcycle: 0.103,
    bus: 0.089,
    train: 0.041,
    subway: 0.033,
    bicycle: 0,
    walking: 0,
    domestic_flight: 0.255,
    international_flight: 0.195,
  },
  // Energy (kg CO2 per kWh)
  energy: {
    electricity_grid: 0.417, // Global average
    natural_gas: 0.185, // per kWh equivalent
    heating_oil: 0.266,
    lpg: 0.214,
    solar: 0.048,
    wind: 0.011,
  },
  // Diet (kg CO2 per day)
  diet: {
    heavy_meat: 7.19,
    medium_meat: 5.63,
    low_meat: 4.67,
    pescatarian: 3.91,
    vegetarian: 3.81,
    vegan: 2.89,
  },
  // Waste (kg CO2 per kg waste)
  waste: {
    landfill: 0.587,
    recycled: 0.021,
    composted: 0.010,
    incinerated: 0.380,
  },
  // Shopping/Consumption (kg CO2 per $ spent monthly)
  shopping: {
    clothing: 0.036,
    electronics: 0.028,
    furniture: 0.022,
    general: 0.015,
  },
  // Water (kg CO2 per liter)
  water: 0.000298,
};

export interface TransportData {
  carType: string;
  carKmPerWeek: number;
  publicTransitKmPerWeek: number;
  publicTransitType: string;
  domesticFlightsPerYear: number;
  internationalFlightsPerYear: number;
  avgFlightHours: number;
}

export interface EnergyData {
  electricityKwhPerMonth: number;
  energySource: string;
  heatingType: string;
  heatingKwhPerMonth: number;
  renewablePercentage: number;
}

export interface DietData {
  dietType: string;
  localFoodPercentage: number;
  foodWastePercentage: number;
}

export interface WasteData {
  wasteKgPerWeek: number;
  recyclingPercentage: number;
  compostingPercentage: number;
}

export interface LifestyleData {
  clothingSpendPerMonth: number;
  electronicsSpendPerMonth: number;
  waterLitersPerDay: number;
  streamingHoursPerDay: number;
}

export interface CarbonResults {
  transport: number;
  energy: number;
  diet: number;
  waste: number;
  lifestyle: number;
  total: number;
  breakdown: { name: string; value: number; color: string }[];
  comparison: { label: string; value: number }[];
  rating: string;
  tips: string[];
}

export function calculateTransport(data: TransportData): number {
  const carFactor = EMISSION_FACTORS.transport[data.carType as keyof typeof EMISSION_FACTORS.transport] || 0;
  const carAnnual = data.carKmPerWeek * 52 * carFactor;

  const transitFactor = EMISSION_FACTORS.transport[data.publicTransitType as keyof typeof EMISSION_FACTORS.transport] || 0.041;
  const transitAnnual = data.publicTransitKmPerWeek * 52 * transitFactor;

  const domesticFlights = data.domesticFlightsPerYear * 800 * EMISSION_FACTORS.transport.domestic_flight;
  const intlFlights = data.internationalFlightsPerYear * data.avgFlightHours * 800 * EMISSION_FACTORS.transport.international_flight;

  return carAnnual + transitAnnual + domesticFlights + intlFlights;
}

export function calculateEnergy(data: EnergyData): number {
  const renewableFactor = 1 - (data.renewablePercentage / 100) * 0.85;
  const electricityAnnual = data.electricityKwhPerMonth * 12 * EMISSION_FACTORS.energy.electricity_grid * renewableFactor;

  const heatingFactor = EMISSION_FACTORS.energy[data.heatingType as keyof typeof EMISSION_FACTORS.energy] || 0.185;
  const isElectricHeating = data.heatingType === "electricity_grid";
  const actualHeatingFactor = isElectricHeating ? heatingFactor * renewableFactor : heatingFactor;
  const heatingAnnual = data.heatingKwhPerMonth * 12 * actualHeatingFactor;

  return electricityAnnual + heatingAnnual;
}

export function calculateDiet(data: DietData): number {
  const baseDiet = EMISSION_FACTORS.diet[data.dietType as keyof typeof EMISSION_FACTORS.diet] || 5.63;
  const localFoodReduction = 1 - (data.localFoodPercentage / 100) * 0.1;
  const wasteIncrease = 1 + (data.foodWastePercentage / 100) * 0.25;

  return baseDiet * 365 * localFoodReduction * wasteIncrease;
}

export function calculateWaste(data: WasteData): number {
  const totalWasteAnnual = data.wasteKgPerWeek * 52;
  const recycled = totalWasteAnnual * (data.recyclingPercentage / 100);
  const composted = totalWasteAnnual * (data.compostingPercentage / 100);
  const landfilled = totalWasteAnnual - recycled - composted;

  return (
    landfilled * EMISSION_FACTORS.waste.landfill +
    recycled * EMISSION_FACTORS.waste.recycled +
    composted * EMISSION_FACTORS.waste.composted
  );
}

export function calculateLifestyle(data: LifestyleData): number {
  const clothing = data.clothingSpendPerMonth * 12 * EMISSION_FACTORS.shopping.clothing;
  const electronics = data.electronicsSpendPerMonth * 12 * EMISSION_FACTORS.shopping.electronics;
  const water = data.waterLitersPerDay * 365 * EMISSION_FACTORS.water;
  const streaming = data.streamingHoursPerDay * 365 * 0.036; // kg CO2 per hour of streaming

  return clothing + electronics + water + streaming;
}

export function calculateTotal(
  transport: TransportData,
  energy: EnergyData,
  diet: DietData,
  waste: WasteData,
  lifestyle: LifestyleData
): CarbonResults {
  const t = calculateTransport(transport);
  const e = calculateEnergy(energy);
  const d = calculateDiet(diet);
  const w = calculateWaste(waste);
  const l = calculateLifestyle(lifestyle);
  const total = t + e + d + w + l;
  const totalTons = total / 1000;

  const rating = totalTons < 2 ? "Excellent" : totalTons < 4 ? "Good" : totalTons < 6 ? "Average" : totalTons < 10 ? "Above Average" : "High";

  const tips: string[] = [];
  if (t > total * 0.3) {
    tips.push("🚗 Transportation is your biggest source. Consider carpooling, cycling, or switching to an electric vehicle.");
    tips.push("✈️ Reducing one round-trip flight can save 500-2000 kg CO2 annually.");
  }
  if (e > total * 0.25) {
    tips.push("⚡ Switch to a renewable energy provider to cut electricity emissions by up to 85%.");
    tips.push("🏠 Improve home insulation to reduce heating energy by 20-40%.");
  }
  if (d > total * 0.25) {
    tips.push("🥗 Reducing meat consumption by half can save over 500 kg CO2 per year.");
    tips.push("🌾 Buy local and seasonal produce to reduce food transportation emissions.");
  }
  if (w > total * 0.1) {
    tips.push("♻️ Increasing recycling to 80% can cut waste emissions by over 90%.");
  }
  tips.push("🌳 Planting trees can offset about 22 kg CO2 per tree per year.");
  tips.push("💡 LED bulbs use 75% less energy than incandescent alternatives.");

  return {
    transport: t,
    energy: e,
    diet: d,
    waste: w,
    lifestyle: l,
    total,
    breakdown: [
      { name: "Transport", value: Math.round(t), color: "hsl(var(--chart-1))" },
      { name: "Energy", value: Math.round(e), color: "hsl(var(--chart-3))" },
      { name: "Diet", value: Math.round(d), color: "hsl(var(--chart-2))" },
      { name: "Waste", value: Math.round(w), color: "hsl(var(--chart-4))" },
      { name: "Lifestyle", value: Math.round(l), color: "hsl(var(--chart-5))" },
    ],
    comparison: [
      { label: "You", value: Math.round(totalTons * 100) / 100 },
      { label: "World Avg", value: 4.7 },
      { label: "US Avg", value: 16.0 },
      { label: "EU Avg", value: 6.8 },
      { label: "India Avg", value: 1.9 },
      { label: "Target 2030", value: 2.5 },
    ],
    rating,
    tips: tips.slice(0, 6),
  };
}
