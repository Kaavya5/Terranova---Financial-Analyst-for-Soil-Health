"""
Rule-Based Cost Estimation Engine.
Calculates detailed fertilizer, seed, labor, irrigation costs.
"""
from dataclasses import dataclass, field
from typing import Dict, Tuple

# ─── Fertilizer nutrient content (% element per kg of product) ────────────────
FERTILIZER_CONTENTS = {
    "Urea":              {"N": 0.46, "P": 0.00, "K": 0.00, "price_per_kg": 6.0},
    "DAP":               {"N": 0.18, "P": 0.46, "K": 0.00, "price_per_kg": 27.0},
    "MOP":               {"N": 0.00, "P": 0.00, "K": 0.60, "price_per_kg": 17.0},
    "SSP":               {"N": 0.00, "P": 0.16, "K": 0.00, "price_per_kg": 8.0},
    "NPK (10-26-26)":    {"N": 0.10, "P": 0.26, "K": 0.26, "price_per_kg": 22.0},
}

# ─── Standard NPK requirements per crop (kg/ha) ────────────────────────────────
CROP_NPK_REQUIREMENTS = {
    "rice":        {"N": 120, "P": 60, "K": 60},
    "wheat":       {"N": 120, "P": 60, "K": 40},
    "maize":       {"N": 120, "P": 60, "K": 40},
    "chickpea":    {"N": 20,  "P": 60, "K": 40},
    "kidneybeans": {"N": 25,  "P": 60, "K": 40},
    "pigeonpeas":  {"N": 20,  "P": 60, "K": 40},
    "mothbeans":   {"N": 20,  "P": 40, "K": 20},
    "mungbean":    {"N": 20,  "P": 60, "K": 40},
    "blackgram":   {"N": 25,  "P": 50, "K": 30},
    "lentil":      {"N": 25,  "P": 60, "K": 40},
    "pomegranate": {"N": 100, "P": 50, "K": 50},
    "banana":      {"N": 200, "P": 60, "K": 250},
    "mango":       {"N": 100, "P": 50, "K": 100},
    "grapes":      {"N": 40,  "P": 40, "K": 50},
    "watermelon":  {"N": 100, "P": 50, "K": 100},
    "muskmelon":   {"N": 100, "P": 50, "K": 80},
    "apple":       {"N": 70,  "P": 35, "K": 70},
    "orange":      {"N": 120, "P": 60, "K": 100},
    "papaya":      {"N": 200, "P": 100,"K": 200},
    "coconut":     {"N": 100, "P": 40, "K": 200},
    "cotton":      {"N": 120, "P": 60, "K": 60},
    "jute":        {"N": 100, "P": 45, "K": 45},
    "coffee":      {"N": 120, "P": 60, "K": 120},
}

# ─── Seed costs per hectare (INR) ─────────────────────────────────────────────
SEED_COSTS = {
    "rice": 2500, "wheat": 2000, "maize": 3500, "chickpea": 3000,
    "kidneybeans": 4000, "pigeonpeas": 2500, "mothbeans": 1800,
    "mungbean": 2500, "blackgram": 2200, "lentil": 2800, "pomegranate": 8000,
    "banana": 12000, "mango": 5000, "grapes": 15000, "watermelon": 5000,
    "muskmelon": 4500, "apple": 20000, "orange": 8000, "papaya": 4000,
    "coconut": 6000, "cotton": 5000, "jute": 1500, "coffee": 10000,
}

# ─── Labor costs per hectare (INR) by irrigation need ─────────────────────────
LABOR_COSTS = {
    "rice": 18000, "wheat": 12000, "maize": 10000, "chickpea": 8000,
    "kidneybeans": 10000, "pigeonpeas": 8000, "mothbeans": 6000,
    "mungbean": 8000, "blackgram": 7000, "lentil": 8000, "pomegranate": 25000,
    "banana": 35000, "mango": 15000, "grapes": 30000, "watermelon": 12000,
    "muskmelon": 10000, "apple": 30000, "orange": 18000, "papaya": 15000,
    "coconut": 10000, "cotton": 14000, "jute": 12000, "coffee": 20000,
}

# ─── Irrigation cost per mm of rainfall deficit (INR/ha) ──────────────────────
IRRIGATION_COST_PER_MM = 15.0  # INR per mm deficit per ha

# ─── Optimal rainfall per crop (mm) ───────────────────────────────────────────
OPTIMAL_RAINFALL = {
    "rice": 225, "wheat": 100, "maize": 130, "chickpea": 65,
    "kidneybeans": 150, "pigeonpeas": 130, "mothbeans": 55,
    "mungbean": 105, "blackgram": 135, "lentil": 50, "pomegranate": 90,
    "banana": 200, "mango": 135, "grapes": 130, "watermelon": 65,
    "muskmelon": 55, "apple": 150, "orange": 140, "papaya": 225,
    "coconut": 200, "cotton": 130, "jute": 250, "coffee": 225,
}

# ─── Pesticide / Machinery defaults ───────────────────────────────────────────
PESTICIDE_COSTS = {
    "rice": 4000, "wheat": 3000, "maize": 3500, "chickpea": 2500,
    "kidneybeans": 3000, "pigeonpeas": 2500, "mothbeans": 1500,
    "mungbean": 2500, "blackgram": 2000, "lentil": 2500, "pomegranate": 8000,
    "banana": 10000, "mango": 5000, "grapes": 12000, "watermelon": 4000,
    "muskmelon": 3500, "apple": 10000, "orange": 5000, "papaya": 5000,
    "coconut": 2000, "cotton": 8000, "jute": 3000, "coffee": 6000,
}
MACHINERY_COSTS = {
    "rice": 6000, "wheat": 7000, "maize": 5000, "chickpea": 4000,
    "kidneybeans": 4000, "pigeonpeas": 4000, "mothbeans": 3000,
    "mungbean": 4000, "blackgram": 3500, "lentil": 4000, "pomegranate": 5000,
    "banana": 5000, "mango": 5000, "grapes": 8000, "watermelon": 4000,
    "muskmelon": 4000, "apple": 8000, "orange": 5000, "papaya": 4000,
    "coconut": 3000, "cotton": 6000, "jute": 5000, "coffee": 4000,
}


@dataclass
class CostBreakdown:
    fertilizer_cost: float = 0.0
    seed_cost: float = 0.0
    labor_cost: float = 0.0
    irrigation_cost: float = 0.0
    pesticide_cost: float = 0.0
    machinery_cost: float = 0.0
    other_costs: float = 0.0
    total_cost: float = 0.0
    fertilizer_recommendations: Dict = field(default_factory=dict)


def compute_fertilizer_cost(
    crop: str, soil_n: float, soil_p: float, soil_k: float, area_ha: float = 1.0
) -> Tuple[float, Dict]:
    """
    Calculate fertilizer cost based on NPK deficits.
    Returns (cost INR, recommendations dict).
    """
    req = CROP_NPK_REQUIREMENTS.get(crop, {"N": 80, "P": 40, "K": 40})
    deficit = {
        "N": max(0.0, req["N"] - soil_n),
        "P": max(0.0, req["P"] - soil_p),
        "K": max(0.0, req["K"] - soil_k),
    }

    recommendations = {}
    total_fert_cost = 0.0

    # Prioritise: Urea for N, DAP for P (also adds N), MOP for K
    n_deficit = deficit["N"]
    p_deficit = deficit["P"]
    k_deficit = deficit["K"]

    # DAP first (covers P and partial N)
    if p_deficit > 0:
        dap_kg = p_deficit / FERTILIZER_CONTENTS["DAP"]["P"]
        n_from_dap = dap_kg * FERTILIZER_CONTENTS["DAP"]["N"]
        n_deficit = max(0, n_deficit - n_from_dap)
        dap_cost = dap_kg * FERTILIZER_CONTENTS["DAP"]["price_per_kg"] * area_ha
        recommendations["DAP"] = {"kg_per_ha": round(dap_kg, 2), "total_cost_inr": round(dap_cost, 2)}
        total_fert_cost += dap_cost

    # Urea for remaining N
    if n_deficit > 0:
        urea_kg = n_deficit / FERTILIZER_CONTENTS["Urea"]["N"]
        urea_cost = urea_kg * FERTILIZER_CONTENTS["Urea"]["price_per_kg"] * area_ha
        recommendations["Urea"] = {"kg_per_ha": round(urea_kg, 2), "total_cost_inr": round(urea_cost, 2)}
        total_fert_cost += urea_cost

    # MOP for K
    if k_deficit > 0:
        mop_kg = k_deficit / FERTILIZER_CONTENTS["MOP"]["K"]
        mop_cost = mop_kg * FERTILIZER_CONTENTS["MOP"]["price_per_kg"] * area_ha
        recommendations["MOP"] = {"kg_per_ha": round(mop_kg, 2), "total_cost_inr": round(mop_cost, 2)}
        total_fert_cost += mop_cost

    # Deficit summary
    recommendations["_nutrient_deficit"] = {
        "N_deficit_kg_ha": round(deficit["N"], 2),
        "P_deficit_kg_ha": round(deficit["P"], 2),
        "K_deficit_kg_ha": round(deficit["K"], 2),
    }
    return round(total_fert_cost, 2), recommendations


def estimate_irrigation_cost(crop: str, actual_rainfall: float, area_ha: float = 1.0) -> float:
    """Calculate irrigation cost based on rainfall deficit vs crop requirement."""
    optimal = OPTIMAL_RAINFALL.get(crop, 150)
    deficit = max(0.0, optimal - actual_rainfall)
    return round(deficit * IRRIGATION_COST_PER_MM * area_ha, 2)


def rule_based_cost_estimate(
    crop: str,
    soil_n: float,
    soil_p: float,
    soil_k: float,
    rainfall: float,
    area_ha: float = 1.0,
) -> CostBreakdown:
    """
    Full rule-based cost estimation for a crop on given area.
    Returns detailed CostBreakdown.
    """
    crop_l = crop.lower()

    fert_cost, fert_recs = compute_fertilizer_cost(crop_l, soil_n, soil_p, soil_k, area_ha)
    seed_cost = SEED_COSTS.get(crop_l, 3000) * area_ha
    labor_cost = LABOR_COSTS.get(crop_l, 10000) * area_ha
    irrig_cost = estimate_irrigation_cost(crop_l, rainfall, area_ha)
    pest_cost = PESTICIDE_COSTS.get(crop_l, 3000) * area_ha
    mach_cost = MACHINERY_COSTS.get(crop_l, 5000) * area_ha
    other = round((fert_cost + seed_cost + labor_cost) * 0.05, 2)  # 5% contingency
    total = round(fert_cost + seed_cost + labor_cost + irrig_cost + pest_cost + mach_cost + other, 2)

    return CostBreakdown(
        fertilizer_cost=fert_cost,
        seed_cost=seed_cost,
        labor_cost=labor_cost,
        irrigation_cost=irrig_cost,
        pesticide_cost=pest_cost,
        machinery_cost=mach_cost,
        other_costs=other,
        total_cost=total,
        fertilizer_recommendations=fert_recs,
    )
