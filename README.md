# Campus_Aura
---

# 🌌 Impact Mood Constellation

**Visualizing Campus Wellness Through AI-Driven Star Clusters**

Impact Mood Constellation is an innovative mental health monitoring platform designed for campuses. By transforming student wellbeing data into interactive, spatially rich visualizations, the platform empowers communities to recognize patterns, share support, and take timely action—all while prioritizing privacy and engagement.

---

## ✨ Novel Features

### 🌟 Mood Constellation Visualization

* Communities appear as **star clusters**.
* **Brightness** represents wellness volume.
* **Pulse frequency** indicates distress rate.
* Spatial metaphors replace traditional bar charts for intuitive insight.

### 📊 Context-Aware Baselines

* AI adjusts sentiment thresholds using:

  * Academic calendar
  * Local weather
  * Campus events
* Reduces false positives during exams, holidays, or special events.

### 🤝 Peer Resonance Network

* Opt-in, anonymous matching with peers sharing similar wellness journeys.
* Focused on **lived experiences**, not demographics.
* Facilitates meaningful peer support.

### 🌊 Wellness Echo System

* Positive cluster shifts trigger a visual **“ripple” across the map**.
* Reinforces community-wide wellbeing momentum.

### 🛡 Tiered Intervention Matrix

* **Tier 1:** Resource drop (sleep hygiene, exam stress toolkit)
* **Tier 2:** Counselor availability heatmap + opt-in chat
* **Tier 3:** Crisis protocol bypass (direct hotline + campus safety link)

---

## ⚡ Existing Landscape

Many campus mental health initiatives exist digitally:

* Anonymous check-ins and peer forums
* Sentiment analysis using NLP to detect anxiety, depression, and distress
* Automated counselor alerts
* Combined peer support and professional guidance

Challenges persist around **privacy, engagement, and accurate early detection**, which Impact Mood Constellation seeks to address through AI, anonymization, and community-driven design.

---

## 🛠 Tech Stack

**Frontend**

* React Native (Expo) / Next.js
* Framer Motion + Lottie for animations
* Three.js for 3D constellation visualization

**Backend**

* FastAPI (Python)
* WebSocket streams for real-time updates
* Redis cache for performance

**Database**

* PostgreSQL (structured metadata)
* TimescaleDB (time-series sentiment data)

**AI/ML Pipeline**

* Hugging Face `distilbert-base-uncased` + GoEmotions fine-tuning
* Prophet / LSTM for temporal trend forecasting
* Federated Learning for **client-side gradient aggregation**
* Explainable AI with SHAP for “why this was flagged”

**Infrastructure**

* AWS ECS + CloudFront
* Vercel Edge Functions for low-latency frontend

**Security & Privacy**

* OAuth 2.0 authentication
* Zero-Knowledge Anonymity Layer
* Differential Privacy noise injection

---

## 🖥 How It Works

1. Students submit wellness check-ins or interact anonymously in peer forums.
2. Sentiment analysis detects emotions and trends in real time.
3. Data feeds into the **Mood Constellation**, visualizing clusters of wellness and distress.
4. AI recommends **tiered interventions** based on contextualized thresholds.
5. Community support and peer resonance propagate positive momentum via the **Wellness Echo System**.

---

## 📈 Future Roadmap

* Mobile-first optimized constellation interface
* Expanded federated learning for campus-wide anonymized model improvements
* Gamified wellness challenges to encourage positive behaviors
* Integration with local mental health resources and hotlines

---

## 🔒 Privacy & Ethics

* All data is anonymized by default
* Zero-Knowledge protocols ensure no personally identifiable information is ever exposed
* Differential privacy prevents model memorization of sensitive details

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/your-org/impact-mood-constellation.git
cd impact-mood-constellation

# Install backend dependencies
pip install -r requirements.txt

# Start backend server
uvicorn backend.main:app --reload

# Start frontend
cd frontend
npm install
npm run dev
```

---

## 🤝 Contributing

We welcome contributions! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📄 License

MIT License © 2026 Impact Mood Constellation

---
