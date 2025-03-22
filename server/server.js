import express from "express";
import cors from "cors";
import fetch from "node-fetch"; // Ensure node-fetch is installed

const app = express();
const port = 3003;

app.use(express.json());
app.use(cors());

const SOLCAST_API_KEY = "8Zrh05IExXu4ReqV8tCltfbTxDBo3li8"; // Replace with actual API key

// 🌞 Fetch Solar Irradiance from Solcast API
async function fetchSolarIrradiance(latitude, longitude) {
    try {
        const endDate = new Date().toISOString().split("T")[0];  // Today's date (YYYY-MM-DD)
        const startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);      // One year ago
        const formattedStartDate = startDate.toISOString().split("T")[0];

        const apiUrl = `https://api.solcast.com.au/radiation/estimated_actuals?latitude=${latitude}&longitude=${longitude}&start=${formattedStartDate}&end=${endDate}&format=json&api_key=${SOLCAST_API_KEY}`;
        
        console.log(`🔗 Fetching data from: ${apiUrl}`);
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            console.log(`⚠️ Solcast API error: ${response.statusText}`);
            return null; // Return null if API fails
        }

        const data = await response.json();
        console.log("📡 Raw API Response:", JSON.stringify(data, null, 2));

        const dniValues = data?.estimated_actuals?.map(entry => entry.dni) || [];
        if (dniValues.length === 0) {
            console.log("⚠️ No DNI data found.");
            return null; // Return null if no data
        }

        console.log(`🔍 Total DNI Readings Received: ${dniValues.length}`);

        // Convert DNI to kWh/m²/year
        const totalIrradiance = dniValues.reduce((sum, dni) => sum + (dni * 0.5 / 1000), 0);

        console.log(`☀️ Total Annual Solar Irradiance (kWh/m²/year): ${totalIrradiance.toFixed(2)}`);
        return totalIrradiance.toFixed(2);
    } catch (error) {
        console.error("❌ Error fetching solar irradiance:", error);
        return null; // Return null in case of an error
    }
}

// 🌞 API Endpoint to Fetch Solar Irradiance
app.post("/solar_irradiance", async (req, res) => {
    const { latitude, longitude } = req.body;
    if (!latitude || !longitude) {
        return res.status(400).json({ error: "Latitude and Longitude are required." });
    }

    const irradiance = await fetchSolarIrradiance(latitude, longitude);
    if (irradiance !== null) {
        res.json({ annual_irradiance: irradiance });
    } else {
        res.status(500).json({ error: "Failed to fetch solar data" });
    }
});

// ✅ `/calculate_solar` uses the fetched irradiance if available
app.post('/calculate_solar', async (req, res) => {
    const { location, area: userAreaInput, panel_quality: userPanelQualityInput, electricityBillAmount, latitude, longitude } = req.body;

    if (!location) return res.status(400).json({ error: "Location is required." });
    if (!electricityBillAmount || isNaN(parseFloat(electricityBillAmount)) || parseFloat(electricityBillAmount) <= 0) {
        return res.status(400).json({ error: "Valid electricity bill amount is required (positive number)." });
    }

    let parsedSolarIrradiance = 1600; // Default value

    if (latitude && longitude) {
        console.log("📍 Fetching solar irradiance for given location...");
        const fetchedIrradiance = await fetchSolarIrradiance(latitude, longitude);
        if (fetchedIrradiance !== null) {
            parsedSolarIrradiance = parseFloat(fetchedIrradiance);
        }
    }

    console.log(`☀️ Using Solar Irradiance: ${parsedSolarIrradiance} kWh/m²/year`);

    try {
        const parsedElectricityBillAmount = parseFloat(electricityBillAmount);
        const electricityUnitPrice = 7.50;
        const monthlyElectricityUsage = parsedElectricityBillAmount / electricityUnitPrice;
        const annualElectricityUsage = monthlyElectricityUsage * 12;

        const panelEfficiencyOptions = {
            "Standard": { efficiency: 0.17, description: "Standard Quality", relativeCost: 1 },
            "Premium": { efficiency: 0.19, description: "Premium Quality", relativeCost: 1.2 },
            "High-End": { efficiency: 0.21, description: "High-End Quality", relativeCost: 1.5 }
        };
        const panelCostPerkW = { "Standard": 60000, "Premium": 75000, "High-End": 90000 };
        const installationCostFactor = 0.3;
        const MINIMUM_SYSTEM_SIZE_KW = 3;

        const panelQualityForCalculations = userPanelQualityInput || "Premium";
        const selectedPanelEfficiency = panelEfficiencyOptions[panelQualityForCalculations].efficiency;
        const selectedPanelCostPerkW = panelCostPerkW[panelQualityForCalculations];

        let suggestedArea, parsedArea, panelPowerCapacitykW;
        if (!userAreaInput) {
            const targetEnergyProduction = annualElectricityUsage;
            const specificYield = parsedSolarIrradiance * 0.75;
            const requiredPanelPowerCapacitykW = targetEnergyProduction / specificYield;
            panelPowerCapacitykW = Math.max(requiredPanelPowerCapacitykW, MINIMUM_SYSTEM_SIZE_KW);
            suggestedArea = panelPowerCapacitykW / selectedPanelEfficiency;
            parsedArea = suggestedArea;
        } else {
            parsedArea = parseFloat(userAreaInput);
            suggestedArea = parsedArea;
            panelPowerCapacitykW = parsedArea * selectedPanelEfficiency;
        }

        const energyProductionPerYear = panelPowerCapacitykW * parsedSolarIrradiance * 0.75;
        const totalPanelCost = panelPowerCapacitykW * selectedPanelCostPerkW;
        const installationCost = totalPanelCost * installationCostFactor;
        const totalInstallationCost = totalPanelCost + installationCost;
        const annualSavings = energyProductionPerYear * electricityUnitPrice;

        const roiYears = annualSavings > 0 ? totalInstallationCost / annualSavings : Infinity;

        const discountRate = 0.05;
        const panelLifespan = 25;
        let netPresentValue = -totalInstallationCost;
        for (let year = 1; year <= panelLifespan; year++) {
            netPresentValue += annualSavings / Math.pow(1 + discountRate, year);
        }

        const pros = ["Eco-friendly", "Reduces energy bills", "Long-term savings", "Increases property value (potentially)", "Energy independence"];
        const cons = ["High upfront cost", "Weather dependent", "Requires space", "Panel degradation over time", "Maintenance required"];

        const results = {
            cost: totalInstallationCost.toFixed(2),
            roi: isFinite(roiYears) ? roiYears.toFixed(1) + " years" : "Never (No Savings)",
            savings: annualSavings.toFixed(2),
            npv: netPresentValue.toFixed(2),
            profitability: netPresentValue > 0 ? "Profitable" : "Not Profitable",
            pros,
            cons,
            energyProduction: energyProductionPerYear.toFixed(2),
            annualElectricityUsage: annualElectricityUsage.toFixed(2),
            solarIrradianceUsed: parsedSolarIrradiance.toFixed(2),
            electricityUnitPriceUsed: electricityUnitPrice.toFixed(2),
            suggestedArea: suggestedArea.toFixed(2),
            suggestedPanelQuality: panelQualityForCalculations,
            suggestedPanelQualityDescription: panelEfficiencyOptions[panelQualityForCalculations].description,
            panelPowerCapacitykW: panelPowerCapacitykW.toFixed(2)
        };

        res.json(results);
    } catch (error) {
        console.error("Error during calculations:", error);
        res.status(500).json({ error: "Failed to process calculation.", details: error.message });
    }
});

app.get('/', (req, res) => {
    res.send('Solar Calculator Backend is running!');
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
