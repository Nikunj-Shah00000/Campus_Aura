# AuraCampus Backend 🌿

**Anonymous. Intelligent. Empathetic.** 
Privacy-first mental wellness platform with federated learning and differential privacy.

## 🛡️ Privacy Features

- **Zero PII Storage** - No personal identifiable information ever stored
- **Differential Privacy** - ε-differential privacy guarantees (ε=0.1)
- **Federated Learning** - Models train locally, only encrypted updates shared
- **Homomorphic Encryption** - Aggregate data remains encrypted during computation
- **Automatic Data Expiry** - All data auto-deletes after 90 days
- **Privacy Audit Logs** - Complete transparency without compromising anonymity

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 6.0+
- Redis 7.0+

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/aura-campus-backend.git
cd aura-campus-backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your configuration

# Start MongoDB and Redis (or use Docker)
docker-compose -f docker/docker-compose.yml up -d

# Run database seed
npm run seed

# Start development server
npm run dev

# Production start
npm start