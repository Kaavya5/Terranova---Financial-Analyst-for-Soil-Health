-- ============================================================
-- AI-Powered Soil Testing & Financial Crop Recommendation DB
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'farmer' CHECK (role IN ('farmer', 'agronomist', 'admin')),
    region VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================================
-- SOIL DATA TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS soil_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    nitrogen FLOAT NOT NULL CHECK (nitrogen >= 0 AND nitrogen <= 200),
    phosphorus FLOAT NOT NULL CHECK (phosphorus >= 0 AND phosphorus <= 200),
    potassium FLOAT NOT NULL CHECK (potassium >= 0 AND potassium <= 200),
    ph FLOAT NOT NULL CHECK (ph >= 0 AND ph <= 14),
    temperature FLOAT NOT NULL,
    humidity FLOAT NOT NULL CHECK (humidity >= 0 AND humidity <= 100),
    rainfall FLOAT NOT NULL CHECK (rainfall >= 0),
    region VARCHAR(100),
    field_area_hectares FLOAT DEFAULT 1.0,
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_soil_data_user_id ON soil_data(user_id);
CREATE INDEX idx_soil_data_recorded_at ON soil_data(recorded_at DESC);

-- ============================================================
-- PREDICTIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    soil_data_id UUID REFERENCES soil_data(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    recommended_crop VARCHAR(100) NOT NULL,
    crop_confidence FLOAT,
    predicted_yield_kg_per_ha FLOAT,
    alternative_crops JSONB DEFAULT '[]',
    model_version VARCHAR(50) DEFAULT '1.0',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_predictions_user_id ON predictions(user_id);
CREATE INDEX idx_predictions_soil_data_id ON predictions(soil_data_id);
CREATE INDEX idx_predictions_crop ON predictions(recommended_crop);

-- ============================================================
-- FINANCIAL REPORTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS financial_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prediction_id UUID REFERENCES predictions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    -- Cost breakdown (INR per hectare)
    fertilizer_cost FLOAT,
    seed_cost FLOAT,
    labor_cost FLOAT,
    irrigation_cost FLOAT,
    pesticide_cost FLOAT,
    machinery_cost FLOAT,
    other_costs FLOAT,
    total_cost FLOAT,
    -- Revenue & Profit
    expected_yield_kg FLOAT,
    market_price_per_kg FLOAT,
    expected_revenue FLOAT,
    expected_profit FLOAT,
    roi_percentage FLOAT,
    -- Rule-based vs ML breakdown
    rule_based_cost FLOAT,
    ml_predicted_cost FLOAT,
    cost_confidence FLOAT,
    -- Fertilizer recommendations
    fertilizer_recommendations JSONB DEFAULT '{}',
    -- Area
    field_area_hectares FLOAT DEFAULT 1.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_financial_reports_user_id ON financial_reports(user_id);
CREATE INDEX idx_financial_reports_prediction_id ON financial_reports(prediction_id);
CREATE INDEX idx_financial_reports_created_at ON financial_reports(created_at DESC);

-- ============================================================
-- CHAT HISTORY TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS chat_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID DEFAULT uuid_generate_v4(),
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    context_prediction_id UUID REFERENCES predictions(id) ON DELETE SET NULL,
    tokens_used INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX idx_chat_history_session_id ON chat_history(session_id);
CREATE INDEX idx_chat_history_created_at ON chat_history(created_at DESC);

-- ============================================================
-- MARKET PRICES TABLE (for region-based pricing)
-- ============================================================
CREATE TABLE IF NOT EXISTS market_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crop_name VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    price_per_kg FLOAT NOT NULL,
    price_date DATE NOT NULL DEFAULT CURRENT_DATE,
    source VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(crop_name, region, price_date)
);

CREATE INDEX idx_market_prices_crop_region ON market_prices(crop_name, region);
CREATE INDEX idx_market_prices_date ON market_prices(price_date DESC);

-- ============================================================
-- TRIGGER: auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- SEED DATA: Market Prices
-- ============================================================
INSERT INTO market_prices (crop_name, region, price_per_kg) VALUES
('rice', 'default', 21.0),
('wheat', 'default', 20.0),
('maize', 'default', 18.0),
('chickpea', 'default', 55.0),
('kidneybeans', 'default', 90.0),
('pigeonpeas', 'default', 65.0),
('mothbeans', 'default', 60.0),
('mungbean', 'default', 70.0),
('blackgram', 'default', 55.0),
('lentil', 'default', 60.0),
('pomegranate', 'default', 80.0),
('banana', 'default', 25.0),
('mango', 'default', 50.0),
('grapes', 'default', 60.0),
('watermelon', 'default', 15.0),
('muskmelon', 'default', 25.0),
('apple', 'default', 80.0),
('orange', 'default', 40.0),
('papaya', 'default', 20.0),
('coconut', 'default', 30.0),
('cotton', 'default', 65.0),
('jute', 'default', 40.0),
('coffee', 'default', 320.0)
ON CONFLICT DO NOTHING;
