import React, { useState } from 'react'
import { useTrust } from '../context/TrustContext'
import TrustScoreCard from '../components/TrustScoreCard'
import RiskBadge from '../components/RiskBadge'
import { 
  Play, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  Eye,
  TrendingUp,
  TrendingDown,
  Zap,
  Target
} from 'lucide-react'

const BookingSimulator = () => {
  const { agents, simulateBooking } = useTrust()
  const [selectedAgent, setSelectedAgent] = useState(agents[0]?.id || '')
  const [bookingAmount, setBookingAmount] = useState(5000)
  const [bookingDescription, setBookingDescription] = useState('Flight booking - Business travel')
  const [simulationResult, setSimulationResult] = useState(null)
  const [isSimulating, setIsSimulating] = useState(false)

  const selectedAgentData = agents.find(a => a.id === selectedAgent)

  const handleSimulate = async () => {
    if (!selectedAgent || !bookingAmount) return

    setIsSimulating(true)
    
    // Simulate processing delay
    setTimeout(() => {
      const result = simulateBooking(selectedAgent, {
        amount: bookingAmount,
        description: bookingDescription
      })
      setSimulationResult(result)
      setIsSimulating(false)
    }, 1500)
  }

  const getDecisionIcon = (decision) => {
    switch (decision) {
      case 'approved':
        return <CheckCircle className="w-6 h-6 text-white" />
      case 'approved_monitored':
        return <Eye className="w-6 h-6 text-white" />
      case 'flagged':
        return <AlertCircle className="w-6 h-6 text-white" />
      case 'blocked':
        return <XCircle className="w-6 h-6 text-white" />
      default:
        return <AlertCircle className="w-6 h-6 text-white" />
    }
  }

  const getDecisionGradient = (decision) => {
    switch (decision) {
      case 'approved':
        return 'bg-gradient-success'
      case 'approved_monitored':
        return 'bg-gradient-primary'
      case 'flagged':
        return 'bg-gradient-warning'
      case 'blocked':
        return 'bg-gradient-danger'
      default:
        return 'bg-gradient-primary'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-heading-1 text-gradient">Booking Simulator</h1>
        <p className="text-body-large text-secondary">Test how the trust system responds to different booking scenarios</p>
      </div>

      <div className="grid grid-2 gap-8">
        {/* Simulation Controls */}
        <div className="card p-8 hover-lift">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-primary rounded-2xl glow-cyan">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-heading-3 text-primary">Simulation Setup</h2>
          </div>
          
          <div className="space-y-6">
            {/* Agent Selection */}
            <div>
              <label className="block text-body-large font-semibold text-primary mb-3">
                Select Agent
              </label>
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="w-full p-4 border-2 border-slate-600 rounded-2xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-body-large font-medium bg-dark-card text-primary shadow-dark dropdown-with-arrow"
              >
                {agents.map(agent => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name} (Trust: {agent.trustScores.overall}, Risk: {agent.riskLevel})
                  </option>
                ))}
              </select>
            </div>

            {/* Booking Amount */}
            <div>
              <label className="block text-body-large font-semibold text-primary mb-3">
                Booking Amount ($)
              </label>
              <input
                type="number"
                value={bookingAmount}
                onChange={(e) => setBookingAmount(Number(e.target.value))}
                className="w-full p-4 border-2 border-slate-600 rounded-2xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-body-large font-medium shadow-dark bg-dark-card text-primary"
                min="100"
                step="100"
              />
            </div>

            {/* Booking Description */}
            <div>
              <label className="block text-body-large font-semibold text-primary mb-3">
                Booking Description
              </label>
              <input
                type="text"
                value={bookingDescription}
                onChange={(e) => setBookingDescription(e.target.value)}
                className="w-full p-4 border-2 border-slate-600 rounded-2xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-body-large font-medium shadow-dark bg-dark-card text-primary"
                placeholder="e.g., Flight booking - Mumbai to Dubai"
              />
            </div>

            {/* Simulate Button */}
            <button
              onClick={handleSimulate}
              disabled={isSimulating || !selectedAgent}
              className="w-full btn btn-primary text-body-large py-4 mt-6"
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Processing Decision...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Simulate Booking
                </>
              )}
            </button>
          </div>
        </div>

        {/* Current Agent Status */}
        {selectedAgentData && (
          <div className="card p-8 hover-lift">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-success rounded-2xl glow-green">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-heading-3 text-primary">Current Agent Status</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gradient-primary-dark rounded-3xl glow-cyan">
                <h3 className="text-heading-4 text-primary">{selectedAgentData.name}</h3>
                <RiskBadge level={selectedAgentData.riskLevel} />
              </div>

              <div className="grid grid-2 gap-6">
                <div className="p-4 bg-dark-card rounded-2xl shadow-dark border-l-4 border-cyan-500">
                  <p className="text-caption text-secondary font-medium">Credit Utilization</p>
                  <p className="text-heading-3 font-bold text-accent">
                    {Math.round((selectedAgentData.creditUsed / selectedAgentData.creditLimit) * 100)}%
                  </p>
                  <p className="text-caption text-muted mt-1">
                    ${selectedAgentData.creditUsed.toLocaleString()} / ${selectedAgentData.creditLimit.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-dark-card rounded-2xl shadow-dark border-l-4 border-green-500">
                  <p className="text-caption text-secondary font-medium">Overall Trust</p>
                  <p className="text-heading-3 font-bold text-success">{selectedAgentData.trustScores.overall}</p>
                </div>
              </div>

              {/* Trust Scores */}
              <div className="space-y-4">
                <TrustScoreCard 
                  title="Financial Trust" 
                  score={selectedAgentData.trustScores.financial}
                  change={0}
                />
                <TrustScoreCard 
                  title="Behavior Trust" 
                  score={selectedAgentData.trustScores.behavior}
                  change={0}
                />
                <TrustScoreCard 
                  title="History Trust" 
                  score={selectedAgentData.trustScores.history}
                  change={0}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Simulation Results */}
      {simulationResult && (
        <div className="card p-8 hover-lift animate-fadeInUp shadow-dark">
          <h2 className="text-heading-2 text-primary mb-8 text-center">Simulation Results</h2>
          
          <div className="grid grid-2 gap-8">
            {/* Decision Output */}
            <div>
              <h3 className="text-heading-4 text-primary mb-4">Decision Output</h3>
              
              <div className={`p-6 rounded-2xl shadow-strong ${getDecisionGradient(simulationResult.decision.action)}`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-white bg-opacity-20 rounded-full">
                    {getDecisionIcon(simulationResult.decision.action)}
                  </div>
                  <span className="text-2xl font-bold text-white capitalize">
                    {simulationResult.decision.action.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-lg text-white opacity-90 mb-4">{simulationResult.decision.reason}</p>
                <div className="flex items-center gap-3 text-sm text-white">
                  <span className="font-medium">Confidence:</span>
                  <div className="flex-1 bg-white bg-opacity-30 rounded-full h-3">
                    <div 
                      className="bg-white h-3 rounded-full transition-all duration-500"
                      style={{ width: `${simulationResult.decision.confidence * 100}%` }}
                    />
                  </div>
                  <span className="font-bold text-lg">{Math.round(simulationResult.decision.confidence * 100)}%</span>
                </div>
              </div>
            </div>

            {/* Trust Changes */}
            <div>
              <h3 className="text-heading-4 text-primary mb-4">Trust Score Changes</h3>
              
              <div className="space-y-4">
                {Object.entries(simulationResult.trustChanges).map(([type, change]) => (
                  <div key={type} className="flex items-center justify-between p-4 bg-gradient-primary-dark rounded-2xl shadow-dark">
                    <span className="text-body-large font-bold text-primary capitalize">{type} Trust</span>
                    <div className="flex items-center gap-3">
                      {change > 0 ? (
                        <div className="p-2 bg-gradient-success rounded-full">
                          <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                      ) : change < 0 ? (
                        <div className="p-2 bg-gradient-danger rounded-full">
                          <TrendingDown className="w-5 h-5 text-white" />
                        </div>
                      ) : null}
                      <span className={`text-heading-4 font-bold ${
                        change > 0 ? 'text-success' : 
                        change < 0 ? 'text-danger' : 'text-secondary'
                      }`}>
                        {change > 0 ? '+' : ''}{change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detected Signals */}
          {simulationResult.signals && simulationResult.signals.length > 0 && (
            <div className="mt-8">
              <h3 className="text-heading-4 text-primary mb-4">Detected Risk Signals</h3>
              <div className="grid grid-2 gap-4">
                {simulationResult.signals.map((signal, index) => (
                  <div key={index} className={`p-4 rounded-2xl border-l-4 shadow-dark ${
                    signal.severity === 'high' ? 'bg-gradient-danger-dark border-red-400 glow-red' :
                    signal.severity === 'medium' ? 'bg-gradient-warning-dark border-yellow-400 glow-orange' :
                    'bg-gradient-primary-dark border-cyan-400 glow-cyan'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-body-large font-bold text-primary capitalize">
                        {signal.type.replace('_', ' ')}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-caption font-bold shadow-dark ${
                        signal.severity === 'high' ? 'bg-gradient-danger text-white' :
                        signal.severity === 'medium' ? 'bg-gradient-warning text-white' :
                        'bg-gradient-primary text-white'
                      }`}>
                        {signal.severity}
                      </span>
                    </div>
                    {signal.value && (
                      <p className="text-caption text-secondary mt-2 font-medium">
                        Value: {typeof signal.value === 'number' ? signal.value.toFixed(2) : signal.value}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default BookingSimulator