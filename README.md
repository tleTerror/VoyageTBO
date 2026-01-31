# TBO Adaptive Trust & Credit Decision System

A comprehensive frontend demo for the TBO Hackathon showcasing an intelligent trust-based credit decision system for travel agents.

## 🎯 Problem Statement

TBO works with travel agents (B2B) who:
- Make high-value bookings
- Often pay later
- Are given credit limits
- Can cause financial risk through misuse, fraud, or sudden activity spikes

Traditional systems use fixed credit limits and binary decisions, which don't scale and block good agents unnecessarily.

## 💡 Our Solution

Instead of asking "Is this agent risky?", we ask **"How much do we trust this agent right now?"**

### Key Features

1. **Dynamic Trust Scoring**
   - Financial Trust (credit usage, payment behavior)
   - Behavior Trust (booking patterns, anomalies)
   - History Trust (past disputes, chargebacks)
   - Overall Trust Score

2. **Intelligent Decision Engine**
   - Risk level assessment (low/medium/high)
   - Confidence scoring
   - Explainable decisions
   - Multiple action types (approve, flag, monitor, block)

3. **Real-time Signal Processing**
   - Booking velocity monitoring
   - Credit utilization tracking
   - Anomaly detection
   - External market signals

4. **Admin Control Panel**
   - Global risk mode settings (Conservative/Balanced/Growth)
   - Strategic agency overrides
   - External signal management
   - System monitoring

5. **Complete Timeline Tracking**
   - Every decision is logged
   - Trust evolution over time
   - Audit trail for compliance

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd adaptive-trust-system

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

## 🏗️ System Architecture

```
Agent Booking → Signal Collection → Trust Update → Decision Engine → Actions + Timeline
```

### Core Components

1. **Signal Collection**: Analyzes booking patterns, credit usage, velocity
2. **Trust Engine**: Updates multi-dimensional trust scores
3. **Decision Engine**: Makes risk-based decisions with explanations
4. **Timeline System**: Maintains complete audit trail
5. **Admin Controls**: Human oversight and strategic overrides

## 📊 Features Overview

### Dashboard
- Real-time agent overview
- Trust score monitoring
- Recent activity feed
- External market signals
- Key performance metrics

### Booking Simulator
- Test different booking scenarios
- See real-time trust calculations
- View decision explanations
- Analyze risk signals

### Agent Timeline
- Complete activity history
- Trust score evolution
- Decision audit trail
- Risk signal tracking

### Admin Control Panel
- Global risk mode management
- Strategic agency overrides
- External signal injection
- System monitoring

## 🎨 UI/UX Highlights

- **Clean, Professional Design**: Modern card-based layout
- **Real-time Updates**: Live trust score changes
- **Visual Risk Indicators**: Color-coded risk levels and trust scores
- **Responsive Design**: Works on desktop and mobile
- **Intuitive Navigation**: Clear information hierarchy

## 🔧 Technical Stack

- **Frontend**: React 18 with Vite
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Charts**: Recharts (ready for data visualization)
- **Styling**: Custom CSS with utility classes
- **State Management**: React Context API

## 📈 Demo Scenarios

### Scenario 1: Normal Booking
- Agent: Premium Travel Co. (High Trust)
- Booking: $5,000 flight
- Result: Approved with trust increase

### Scenario 2: High Risk Booking  
- Agent: Quick Tours Ltd. (Medium Trust)
- Booking: $12,000 large group
- Result: Flagged for manual review

### Scenario 3: Credit Limit Breach
- Agent: Any agent near credit limit
- Booking: Amount exceeding limit
- Result: Blocked with explanation


