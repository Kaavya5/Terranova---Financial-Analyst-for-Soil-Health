# 🌱 Terra Nova — AI-Powered Soil Testing & Financial Crop Recommendation

An end-to-end intelligent precision farming platform. Enter soil nutrient data, get ML-powered crop recommendations, full financial forecasts, and AI agronomist chat — all powered by **Anthropic Claude**.

---

## 🚀 Live Stack

| Layer | Tech | Hosting |
|---|---|---|
| Frontend | Next.js 16 + Tailwind CSS | **Vercel** |
| Backend API | FastAPI (Python) | **Render** |
| ML Service | FastAPI + Scikit-learn | **Render** |
| Database | SQLite (dev) / PostgreSQL (prod) | Render / Supabase |
| AI Chat | **Anthropic Claude** (claude-sonnet-4-5) | via API |

---

## 📂 Project Structure

```
terranova/
├── frontend/         # Next.js app (deploy to Vercel)
│   ├── src/app/      # Pages: /, /soil-analysis, /financials, /reports, /chat
│   ├── src/components/
│   └── vercel.json
├── backend/          # FastAPI REST API (deploy to Render)
│   ├── app/
│   │   ├── api/routes/   auth, predict, chat, reports
│   │   ├── models/       SQLAlchemy ORM models
│   │   ├── schemas/      Pydantic request/response schemas
│   │   └── services/     chat_service (Claude), ml_client
│   ├── main.py
│   ├── requirements.txt
│   └── render.yaml
├── ml_service/       # Scikit-learn inference service (deploy to Render)
│   ├── main.py
│   ├── cost_engine.py
│   ├── models/       Pre-trained .pkl files
│   └── render.yaml
├── database/
│   └── schema.sql
└── .env.example      # Copy to .env, fill in secrets
```

---

## ⚙️ Local Development (5-minute setup)

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git

### 1. Clone & setup environment
```bash
git clone <your-repo-url>
cd terranova
cp .env.example .env
# Edit .env — add your ANTHROPIC_API_KEY at minimum
```

### 2. Start ML Service
```bash
cd ml_service
pip install -r requirements.txt
uvicorn main:app --port 8001 --reload
# Health check: http://localhost:8001/health
```

### 3. Start Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --port 8000 --reload
# Docs: http://localhost:8000/docs
```

### 4. Start Frontend
```bash
cd frontend
npm install
# Create frontend/.env.local:
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
npm run dev
# Open: http://localhost:3000
```

---

## ☁️ Production Deployment

### Step 1: Deploy ML Service to Render

1. Push your repo to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo, set **Root Directory** = `ml_service`
4. Build command: `pip install -r requirements.txt`
5. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Copy the service URL (e.g. `https://terranova-ml.onrender.com`)

### Step 2: Deploy Backend to Render

1. New Web Service → connect same repo
2. **Root Directory** = `backend`
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add these **Environment Variables** in Render dashboard:

| Key | Value |
|---|---|
| `ANTHROPIC_API_KEY` | `sk-ant-...` (from console.anthropic.com) |
| `ML_SERVICE_URL` | `https://terranova-ml.onrender.com` |
| `SECRET_KEY` | Any long random string |
| `CORS_ORIGINS` | `https://your-app.vercel.app` (set after step 3) |
| `DATABASE_URL` | `sqlite+aiosqlite:///./sql_app.db` (or Postgres URL) |

6. Copy the backend URL (e.g. `https://terranova-backend.onrender.com`)

### Step 3: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Set **Root Directory** = `frontend`
4. Add **Environment Variable**:
   - `NEXT_PUBLIC_API_URL` = `https://terranova-backend.onrender.com`
5. Deploy!
6. Copy your Vercel URL and update `CORS_ORIGINS` in Render backend settings

### Step 4: Update CORS
Go back to Render backend → Environment → update `CORS_ORIGINS` to your Vercel URL.

---

## 🔑 Required API Keys

| Key | Where to get | Cost |
|---|---|---|
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) | Pay-per-use, ~$0.003/chat message |

The app works without the Anthropic key (chat returns a placeholder message). All other features (ML predictions, financials, reports) work fully without any external API keys.

---

## 🌾 Features

- **Soil Analysis** — Enter N, P, K, pH, temperature, humidity, rainfall + field area
- **AI Crop Recommendation** — Random Forest model trained on 2,000+ crop-soil profiles
- **Financial Dashboard** — Cost breakdown, yield forecast, profit & ROI calculation in INR
- **Historical Reports** — All analyses saved, with chart trends and CSV export
- **AI Agronomist Chat** — Powered by Anthropic Claude, context-aware of your latest prediction

---

## 🧠 ML Models

All models are pre-trained and included in `ml_service/models/`:

| Model | Algorithm | Purpose |
|---|---|---|
| `crop_model.pkl` | Random Forest Classifier | Recommend optimal crop from soil data |
| `yield_model.pkl` | Gradient Boosted Regressor | Predict yield (kg/ha) |
| `cost_model.pkl` | Random Forest Regressor | Estimate cultivation cost |
| `cost_engine.py` | Rule-based | Fertilizer deficit → cost calculation |

Cost prediction uses a **blended approach**: 70% rule-based + 30% ML for robustness.

---

## 👤 Demo Login

The app auto-creates a demo user on first run:
- Email: `admin@terranova.com`
- Password: `password123`

---

## 📈 Future Enhancements

- IoT real-time soil sensor integration
- Dynamic MSP / market price API feeds
- Multi-user farm management with roles
- PDF report export
- Mobile app (React Native)
