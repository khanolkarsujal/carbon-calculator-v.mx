import {
    calculateTransport,
    calculateEnergy,
    calculateDiet,
    calculateWaste,
    calculateLifestyle,
    calculateTotal
} from "./src/lib/carbon-calculations";
import * as fs from "fs";

const transport = { carType: "car_petrol", carKmPerWeek: 100, publicTransitKmPerWeek: 30, publicTransitType: "bus", domesticFlightsPerYear: 2, internationalFlightsPerYear: 1, avgFlightHours: 4 };
const energy = { electricityKwhPerMonth: 300, energySource: "electricity_grid", heatingType: "natural_gas", heatingKwhPerMonth: 200, renewablePercentage: 10 };
const diet = { dietType: "medium_meat", localFoodPercentage: 20, foodWastePercentage: 15 };
const waste = { wasteKgPerWeek: 8, recyclingPercentage: 30, compostingPercentage: 5 };
const lifestyle = { clothingSpendPerMonth: 100, electronicsSpendPerMonth: 50, waterLitersPerDay: 150, streamingHoursPerDay: 3 };

const total = calculateTotal(transport, energy, diet, waste, lifestyle);
fs.writeFileSync("res.json", JSON.stringify(total, null, 2), "utf-8");
