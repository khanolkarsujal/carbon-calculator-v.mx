import { describe, it, expect } from "vitest";
import {
    calculateTransport,
    calculateEnergy,
    calculateDiet,
    calculateWaste,
    calculateLifestyle,
    calculateTotal
} from "./carbon-calculations";

describe("Carbon Calculations", () => {
    it("should calculate transport correctly for default values", () => {
        const data = {
            carType: "car_petrol",
            carKmPerWeek: 100, // 100 * 52 * 0.192 = 998.4
            publicTransitKmPerWeek: 30, // 30 * 52 * 0.089 = 138.84
            publicTransitType: "bus",
            domesticFlightsPerYear: 2, // 2 * 800 * 0.255 = 408
            internationalFlightsPerYear: 1, // 1 * 4 * 800 * 0.195 = 624
            avgFlightHours: 4,
        };
        const result = calculateTransport(data);
        expect(result).toBeCloseTo(998.4 + 138.84 + 408 + 624);
    });

    it("should calculate energy correctly for actual heating with fossil fuels", () => {
        const data = {
            electricityKwhPerMonth: 300,
            energySource: "electricity_grid",
            heatingType: "natural_gas",
            heatingKwhPerMonth: 200,
            renewablePercentage: 0,
        };
        const result = calculateEnergy(data);
        // electricity: 300 * 12 * 0.417 = 1501.2
        // heating: 200 * 12 * 0.185 = 444
        expect(result).toBeCloseTo(1501.2 + 444);
    });

    it("should apply renewable percentage to electric heating correctly", () => {
        const data = {
            electricityKwhPerMonth: 300,
            energySource: "electricity_grid",
            heatingType: "electricity_grid",
            heatingKwhPerMonth: 200,
            renewablePercentage: 100,
        };
        const result = calculateEnergy(data);
        // renewableFactor = 1 - 1 * 0.85 = 0.15
        // electricity: 300 * 12 * 0.417 * 0.15 = 225.18
        // heating: 200 * 12 * 0.417 * 0.15 = 150.12
        expect(result).toBeCloseTo(225.18 + 150.12);
    });

    it("should calculate diet correctly based on meat consumption and local food", () => {
        const data = {
            dietType: "vegan", // 2.89 factor
            localFoodPercentage: 100, // 1 - 1 * 0.1 = 0.9
            foodWastePercentage: 0, // 1 + 0 = 1
        };
        const result = calculateDiet(data);
        expect(result).toBeCloseTo(2.89 * 365 * 0.9);
    });

    it("should calculate waste correctly based on recycling/composting percentages", () => {
        const data = {
            wasteKgPerWeek: 10, // 520 / yr
            recyclingPercentage: 50, // 260 recycled
            compostingPercentage: 20, // 104 composted
        };
        // 156 landfilled.
        // 156 * 0.587 + 260 * 0.021 + 104 * 0.010 = 91.572 + 5.46 + 1.04 = 98.072
        const result = calculateWaste(data);
        expect(result).toBeCloseTo(98.072);
    });

    it("should calculate total correctly", () => {
        const transport = { carType: "car_electric", carKmPerWeek: 0, publicTransitKmPerWeek: 0, publicTransitType: "bus", domesticFlightsPerYear: 0, internationalFlightsPerYear: 0, avgFlightHours: 0 };
        const energy = { electricityKwhPerMonth: 0, energySource: "electricity_grid", heatingType: "natural_gas", heatingKwhPerMonth: 0, renewablePercentage: 0 };
        const diet = { dietType: "vegan", localFoodPercentage: 100, foodWastePercentage: 0 };
        const waste = { wasteKgPerWeek: 0, recyclingPercentage: 0, compostingPercentage: 0 };
        const lifestyle = { clothingSpendPerMonth: 0, electronicsSpendPerMonth: 0, waterLitersPerDay: 0, streamingHoursPerDay: 0 };

        const total = calculateTotal(transport, energy, diet, waste, lifestyle);
        expect(total.total).toBeCloseTo(2.89 * 365 * 0.9);
        expect(total.rating).toBe("Excellent");
    });
});
