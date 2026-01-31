import React, { createContext, useContext, useState } from 'react'

const TrustContext = createContext()

export const useTrust = () => {
  const context = useContext(TrustContext)
  if (!context) {
    throw new Error('useTrust must be used within a TrustProvider')
  }
  return context
}

// Mock data for agents
const initialAgents = [
  {
    id: 'AG001',
    name: 'Premium Travel Co.',
    email: 'contact@premiumtravel.com',
    trustScores: {
      financial: 85,
      behavior: 92,
      history: 88,
      overall: 88
    },
    creditLimit: 50000,
    creditUsed: 32000,
    riskLevel: 'low',
    lastActivity: new Date('2024-01-30T10:30:00'),
    timeline: [
      {
        id: 1,
        timestamp: new Date('2024-01-30T10:30:00'),
        type: 'booking',
        amount: 5000,
        description: 'Flight booking - Mumbai to Dubai',
        trustChange: { financial: +2, behavior: +1, history: 0 },
        decision: 'approved',
        reason: 'Normal booking pattern, good payment history'
      },
      {
        id: 2,
        timestamp: new Date('2024-01-29T15:45:00'),
        type: 'payment',
        amount: 8000,
        description: 'Payment received for previous bookings',
        trustChange: { financial: +3, behavior: +1, history: +1 },
        decision: 'processed',
        reason: 'On-time payment, trust increased'
      }
    ]
  },
  {
    id: 'AG002',
    name: 'Quick Tours Ltd.',
    email: 'ops@quicktours.com',
    trustScores: {
      financial: 65,
      behavior: 45,
      history: 70,
      overall: 60
    },
    creditLimit: 30000,
    creditUsed: 28500,
    riskLevel: 'high',
    lastActivity: new Date('2024-01-30T14:20:00'),
    timeline: [
      {
        id: 3,
        timestamp: new Date('2024-01-30T14:20:00'),
        type: 'booking',
        amount: 12000,
        description: 'Large group booking - 15 passengers',
        trustChange: { financial: -5, behavior: -8, history: 0 },
        decision: 'flagged',
        reason: 'Unusual booking size, high credit utilization'
      }
    ]
  },
  {
    id: 'AG003',
    name: 'Elite Business Travel',
    email: 'bookings@elitebiz.com',
    trustScores: {
      financial: 95,
      behavior: 88,
      history: 92,
      overall: 92
    },
    creditLimit: 100000,
    creditUsed: 45000,
    riskLevel: 'low',
    lastActivity: new Date('2024-01-30T09:15:00'),
    timeline: []
  }
]

export const TrustProvider = ({ children }) => {
  const [agents, setAgents] = useState(initialAgents)
  const [globalRiskMode, setGlobalRiskMode] = useState('balanced')
  const [externalSignals, setExternalSignals] = useState([
    {
      id: 1,
      type: 'market',
      severity: 'medium',
      message: 'Travel demand increased by 15% this week',
      timestamp: new Date('2024-01-30T08:00:00'),
      suggestion: 'Consider increasing credit limits for top performers'
    },
    {
      id: 2,
      type: 'geopolitical',
      severity: 'low',
      message: 'Stable conditions in major travel corridors',
      timestamp: new Date('2024-01-29T12:00:00'),
      suggestion: 'Normal operations recommended'
    }
  ])

  const updateAgentTrust = (agentId, trustChanges, newEvent) => {
    setAgents(prev => prev.map(agent => {
      if (agent.id === agentId) {
        const newTrustScores = {
          financial: Math.max(0, Math.min(100, agent.trustScores.financial + (trustChanges.financial || 0))),
          behavior: Math.max(0, Math.min(100, agent.trustScores.behavior + (trustChanges.behavior || 0))),
          history: Math.max(0, Math.min(100, agent.trustScores.history + (trustChanges.history || 0)))
        }
        
        newTrustScores.overall = Math.round(
          (newTrustScores.financial + newTrustScores.behavior + newTrustScores.history) / 3
        )

        // Determine risk level based on overall trust
        let riskLevel = 'low'
        if (newTrustScores.overall < 50) riskLevel = 'high'
        else if (newTrustScores.overall < 75) riskLevel = 'medium'

        return {
          ...agent,
          trustScores: newTrustScores,
          riskLevel,
          lastActivity: new Date(),
          timeline: [newEvent, ...agent.timeline]
        }
      }
      return agent
    }))
  }

  const simulateBooking = (agentId, bookingData) => {
    const agent = agents.find(a => a.id === agentId)
    if (!agent) return

    // Calculate trust changes based on booking signals
    const signals = analyzeBookingSignals(agent, bookingData)
    const trustChanges = calculateTrustChanges(signals, globalRiskMode)
    const decision = makeDecision(agent, bookingData, signals, globalRiskMode)

    const newEvent = {
      id: Date.now(),
      timestamp: new Date(),
      type: 'booking',
      amount: bookingData.amount,
      description: bookingData.description,
      trustChange: trustChanges,
      decision: decision.action,
      reason: decision.reason,
      signals: signals
    }

    updateAgentTrust(agentId, trustChanges, newEvent)
    return { decision, trustChanges, signals }
  }

  const analyzeBookingSignals = (agent, booking) => {
    const signals = []
    
    // Credit utilization signal
    const newUtilization = (agent.creditUsed + booking.amount) / agent.creditLimit
    if (newUtilization > 0.9) {
      signals.push({ type: 'credit_high', severity: 'high', value: newUtilization })
    } else if (newUtilization > 0.7) {
      signals.push({ type: 'credit_medium', severity: 'medium', value: newUtilization })
    }

    // Booking size signal
    const avgBooking = agent.timeline
      .filter(t => t.type === 'booking')
      .reduce((sum, t, _, arr) => sum + t.amount / arr.length, 0) || 5000
    
    if (booking.amount > avgBooking * 3) {
      signals.push({ type: 'large_booking', severity: 'high', value: booking.amount / avgBooking })
    } else if (booking.amount > avgBooking * 1.5) {
      signals.push({ type: 'medium_booking', severity: 'medium', value: booking.amount / avgBooking })
    }

    // Velocity signal (bookings in last hour)
    const recentBookings = agent.timeline.filter(t => 
      t.type === 'booking' && 
      new Date() - t.timestamp < 60 * 60 * 1000
    ).length
    
    if (recentBookings >= 3) {
      signals.push({ type: 'high_velocity', severity: 'high', value: recentBookings })
    }

    return signals
  }

  const calculateTrustChanges = (signals, riskMode) => {
    let changes = { financial: 0, behavior: 0, history: 0 }
    
    const multiplier = riskMode === 'conservative' ? 1.5 : riskMode === 'growth' ? 0.7 : 1.0

    signals.forEach(signal => {
      switch (signal.type) {
        case 'credit_high':
          changes.financial -= 8 * multiplier
          changes.behavior -= 5 * multiplier
          break
        case 'credit_medium':
          changes.financial -= 3 * multiplier
          break
        case 'large_booking':
          changes.behavior -= 6 * multiplier
          break
        case 'medium_booking':
          changes.behavior -= 2 * multiplier
          break
        case 'high_velocity':
          changes.behavior -= 10 * multiplier
          break
        default:
          // Normal booking - small positive change
          changes.financial += 1
          changes.behavior += 1
      }
    })

    // If no negative signals, give small positive boost
    if (signals.length === 0) {
      changes.financial += 2
      changes.behavior += 1
    }

    return changes
  }

  const makeDecision = (agent, booking, signals, riskMode) => {
    const highRiskSignals = signals.filter(s => s.severity === 'high')
    const mediumRiskSignals = signals.filter(s => s.severity === 'medium')
    
    if (highRiskSignals.length > 0) {
      if (riskMode === 'conservative') {
        return {
          action: 'blocked',
          reason: `High risk detected: ${highRiskSignals.map(s => s.type).join(', ')}. Conservative mode active.`,
          confidence: 0.9
        }
      } else {
        return {
          action: 'flagged',
          reason: `Requires manual review: ${highRiskSignals.map(s => s.type).join(', ')}`,
          confidence: 0.8
        }
      }
    }
    
    if (mediumRiskSignals.length >= 2) {
      return {
        action: 'flagged',
        reason: `Multiple medium risk signals: ${mediumRiskSignals.map(s => s.type).join(', ')}`,
        confidence: 0.7
      }
    }
    
    if (mediumRiskSignals.length === 1) {
      return {
        action: 'approved_monitored',
        reason: `Approved with monitoring: ${mediumRiskSignals[0].type}`,
        confidence: 0.8
      }
    }
    
    return {
      action: 'approved',
      reason: 'Normal booking pattern, no risk signals detected',
      confidence: 0.95
    }
  }

  const value = {
    agents,
    globalRiskMode,
    externalSignals,
    setGlobalRiskMode,
    simulateBooking,
    updateAgentTrust,
    setExternalSignals
  }

  return (
    <TrustContext.Provider value={value}>
      {children}
    </TrustContext.Provider>
  )
}