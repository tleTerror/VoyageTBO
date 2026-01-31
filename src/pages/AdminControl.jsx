import React, { useState } from 'react'
import { useTrust } from '../context/TrustContext'
import { 
  Settings, 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  Users,
  Globe,
  Save,
  RefreshCw,
  Plus,
  X,
  Zap,
  Target,
  BarChart3
} from 'lucide-react'

const AdminControl = () => {
  const { 
    agents, 
    globalRiskMode, 
    setGlobalRiskMode, 
    externalSignals, 
    setExternalSignals 
  } = useTrust()
  
  const [agencyOverrides, setAgencyOverrides] = useState([])
  const [newOverride, setNewOverride] = useState({
    agentId: '',
    type: 'credit_increase',
    value: 20,
    duration: 30,
    reason: ''
  })
  const [newSignal, setNewSignal] = useState({
    type: 'market',
    severity: 'medium',
    message: '',
    suggestion: ''
  })

  const riskModes = [
    {
      id: 'conservative',
      name: 'Conservative Mode',
      description: 'Protect cash flow - stricter risk assessment',
      icon: Shield,
      gradient: 'bg-gradient-danger'
    },
    {
      id: 'balanced',
      name: 'Balanced Mode',
      description: 'Normal operations - standard risk tolerance',
      icon: Settings,
      gradient: 'bg-gradient-primary'
    },
    {
      id: 'growth',
      name: 'Growth Mode',
      description: 'Enable growth - relaxed risk assessment',
      icon: TrendingUp,
      gradient: 'bg-gradient-success'
    }
  ]

  const handleAddOverride = () => {
    if (!newOverride.agentId || !newOverride.reason) return

    const override = {
      id: Date.now(),
      ...newOverride,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + newOverride.duration * 24 * 60 * 60 * 1000)
    }

    setAgencyOverrides(prev => [...prev, override])
    setNewOverride({
      agentId: '',
      type: 'credit_increase',
      value: 20,
      duration: 30,
      reason: ''
    })
  }

  const handleRemoveOverride = (id) => {
    setAgencyOverrides(prev => prev.filter(o => o.id !== id))
  }

  const handleAddSignal = () => {
    if (!newSignal.message || !newSignal.suggestion) return

    const signal = {
      id: Date.now(),
      ...newSignal,
      timestamp: new Date()
    }

    setExternalSignals(prev => [signal, ...prev])
    setNewSignal({
      type: 'market',
      severity: 'medium',
      message: '',
      suggestion: ''
    })
  }

  const getAgentName = (agentId) => {
    const agent = agents.find(a => a.id === agentId)
    return agent ? agent.name : 'Unknown Agent'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-heading-1 text-gradient">Admin Control Panel</h1>
        <p className="text-body-large text-secondary">Manage global risk settings and strategic overrides</p>
      </div>

      <div className="grid grid-2 gap-8">
        {/* Global Risk Mode */}
        <div className="card p-8 hover-lift">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-primary rounded-2xl glow-cyan">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-heading-3 text-primary">Global Risk Mode</h2>
          </div>
          
          <div className="space-y-4">
            {riskModes.map(mode => {
              const Icon = mode.icon
              const isActive = globalRiskMode === mode.id
              
              return (
                <div
                  key={mode.id}
                  onClick={() => setGlobalRiskMode(mode.id)}
                  className={`p-6 rounded-3xl border-2 cursor-pointer transition-all duration-300 hover:shadow-dark ${
                    isActive 
                      ? `${mode.gradient} text-white shadow-dark glow-cyan transform scale-105 border-transparent` 
                      : 'border-slate-600 hover:border-slate-500 bg-gradient-primary-dark hover:glow-cyan'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-2xl ${isActive ? 'bg-white bg-opacity-20' : 'bg-dark-card shadow-dark'}`}>
                      <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-accent'}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-heading-4 mb-2 ${isActive ? 'text-white' : 'text-primary'}`}>
                        {mode.name}
                      </h3>
                      <p className={`text-body ${isActive ? 'text-white opacity-90' : 'text-secondary'}`}>
                        {mode.description}
                      </p>
                    </div>
                    {isActive && (
                      <div className="w-4 h-4 rounded-full bg-white shadow-dark" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 p-6 bg-gradient-primary-dark rounded-3xl glow-cyan">
            <p className="text-body-large font-semibold text-primary mb-2">Current Impact:</p>
            <p className="text-body text-secondary">
              {globalRiskMode === 'conservative' 
                ? 'Trust penalties increased by 50%, stricter approval thresholds'
                : globalRiskMode === 'growth'
                ? 'Trust penalties reduced by 30%, relaxed approval thresholds'
                : 'Standard trust calculation and approval thresholds'
              }
            </p>
          </div>
        </div>

        {/* System Overview */}
        <div className="card p-8 hover-lift">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-success rounded-2xl glow-green">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-heading-3 text-primary">System Overview</h2>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-2 gap-4">
              <div className="text-center p-6 bg-gradient-primary rounded-3xl text-white glow-cyan">
                <p className="text-heading-1 font-bold mb-2">{agents.length}</p>
                <p className="text-body-large font-medium opacity-90">Total Agents</p>
              </div>
              <div className="text-center p-6 bg-gradient-danger rounded-3xl text-white glow-red">
                <p className="text-heading-1 font-bold mb-2">
                  {agents.filter(a => a.riskLevel === 'high').length}
                </p>
                <p className="text-body-large font-medium opacity-90">High Risk</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gradient-primary-dark rounded-2xl glow-cyan">
                <span className="text-body-large font-semibold text-primary">Average Trust Score</span>
                <span className="text-heading-4 font-bold text-accent">
                  {Math.round(agents.reduce((sum, a) => sum + a.trustScores.overall, 0) / agents.length)}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-success-dark rounded-2xl glow-green">
                <span className="text-body-large font-semibold text-primary">Total Credit Limit</span>
                <span className="text-heading-4 font-bold text-success">
                  ${agents.reduce((sum, a) => sum + a.creditLimit, 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-purple-dark rounded-2xl glow-purple">
                <span className="text-body-large font-semibold text-primary">Credit Utilization</span>
                <span className="text-heading-4 font-bold text-purple">
                  {Math.round(
                    (agents.reduce((sum, a) => sum + a.creditUsed, 0) / 
                     agents.reduce((sum, a) => sum + a.creditLimit, 0)) * 100
                  )}%
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-600">
              <div className="flex items-center gap-3 text-body text-primary mb-2">
                <div className="w-3 h-3 bg-gradient-success rounded-full animate-pulse glow-green"></div>
                <span className="font-semibold">System Status: Operational</span>
              </div>
              <div className="flex items-center gap-3 text-body text-secondary">
                <RefreshCw className="w-4 h-4" />
                <span className="font-medium">Last Updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Agency Overrides */}
      <div className="card p-8 hover-lift">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-warning rounded-2xl glow-orange">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-heading-3 text-primary">Strategic Agency Overrides</h2>
        </div>

        {/* Add New Override */}
        <div className="bg-gradient-primary-dark p-6 rounded-3xl mb-6 glow-cyan">
          <h3 className="text-heading-4 text-primary mb-4">Add New Override</h3>
          <div className="grid grid-4 gap-4">
            <select
              value={newOverride.agentId}
              onChange={(e) => setNewOverride(prev => ({ ...prev, agentId: e.target.value }))}
              className="p-3 border-2 border-slate-600 rounded-2xl text-body-large font-medium shadow-dark bg-dark-card text-primary dropdown-with-arrow"
            >
              <option value="">Select Agent</option>
              {agents.map(agent => (
                <option key={agent.id} value={agent.id}>{agent.name}</option>
              ))}
            </select>

            <select
              value={newOverride.type}
              onChange={(e) => setNewOverride(prev => ({ ...prev, type: e.target.value }))}
              className="p-3 border-2 border-slate-600 rounded-2xl text-body-large font-medium shadow-dark bg-dark-card text-primary dropdown-with-arrow"
            >
              <option value="credit_increase">Credit Increase</option>
              <option value="ignore_anomalies">Ignore Anomalies</option>
              <option value="priority_approval">Priority Approval</option>
            </select>

            <input
              type="number"
              value={newOverride.value}
              onChange={(e) => setNewOverride(prev => ({ ...prev, value: Number(e.target.value) }))}
              placeholder="Value (%)"
              className="p-3 border-2 border-slate-600 rounded-2xl text-body-large font-medium shadow-dark bg-dark-card text-primary"
            />

            <input
              type="number"
              value={newOverride.duration}
              onChange={(e) => setNewOverride(prev => ({ ...prev, duration: Number(e.target.value) }))}
              placeholder="Duration (days)"
              className="p-3 border-2 border-slate-600 rounded-2xl text-body-large font-medium shadow-dark bg-dark-card text-primary"
            />
          </div>
          
          <div className="mt-4 flex gap-4">
            <input
              type="text"
              value={newOverride.reason}
              onChange={(e) => setNewOverride(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="Reason for override..."
              className="flex-1 p-3 border-2 border-slate-600 rounded-2xl text-body-large font-medium shadow-dark bg-dark-card text-primary"
            />
            <button
              onClick={handleAddOverride}
              disabled={!newOverride.agentId || !newOverride.reason}
              className="btn btn-primary text-body-large"
            >
              <Plus className="w-5 h-5" />
              Add Override
            </button>
          </div>
        </div>

        {/* Active Overrides */}
        <div className="space-y-4">
          {agencyOverrides.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl max-w-md mx-auto">
                <p className="text-xl text-gray-600 font-medium">No active overrides</p>
              </div>
            </div>
          ) : (
            agencyOverrides.map(override => (
              <div key={override.id} className="flex items-center justify-between p-6 bg-gradient-primary-dark rounded-3xl shadow-dark glow-cyan">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-heading-4 text-primary">{getAgentName(override.agentId)}</span>
                    <span className="px-4 py-2 bg-gradient-primary text-white rounded-2xl text-caption font-bold shadow-dark">
                      {override.type.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-body text-secondary mb-2">{override.reason}</p>
                  <p className="text-caption text-muted font-medium">
                    Expires: {override.expiresAt.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-heading-3 font-bold text-accent">+{override.value}%</span>
                  <button
                    onClick={() => handleRemoveOverride(override.id)}
                    className="p-2 text-secondary hover:text-danger hover:bg-gradient-danger-dark rounded-2xl transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* External Market Signals */}
      <div className="card p-8 hover-lift">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-info rounded-2xl glow-purple">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-heading-3 text-primary">External Market Signals</h2>
        </div>

        {/* Add New Signal */}
        <div className="bg-gradient-purple-dark p-6 rounded-3xl mb-6 glow-purple">
          <h3 className="text-heading-4 text-primary mb-4">Add Market Signal</h3>
          <div className="grid grid-2 gap-4 mb-4">
            <select
              value={newSignal.type}
              onChange={(e) => setNewSignal(prev => ({ ...prev, type: e.target.value }))}
              className="p-3 border-2 border-slate-600 rounded-2xl text-body-large font-medium shadow-dark bg-dark-card text-primary dropdown-with-arrow"
            >
              <option value="market">Market Condition</option>
              <option value="geopolitical">Geopolitical</option>
              <option value="economic">Economic</option>
              <option value="industry">Industry News</option>
            </select>

            <select
              value={newSignal.severity}
              onChange={(e) => setNewSignal(prev => ({ ...prev, severity: e.target.value }))}
              className="p-3 border-2 border-slate-600 rounded-2xl text-body-large font-medium shadow-dark bg-dark-card text-primary dropdown-with-arrow"
            >
              <option value="low">Low Impact</option>
              <option value="medium">Medium Impact</option>
              <option value="high">High Impact</option>
            </select>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              value={newSignal.message}
              onChange={(e) => setNewSignal(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Signal description..."
              className="w-full p-3 border-2 border-slate-600 rounded-2xl text-body-large font-medium shadow-dark bg-dark-card text-primary"
            />
            <input
              type="text"
              value={newSignal.suggestion}
              onChange={(e) => setNewSignal(prev => ({ ...prev, suggestion: e.target.value }))}
              placeholder="Suggested action..."
              className="w-full p-3 border-2 border-slate-600 rounded-2xl text-body-large font-medium shadow-dark bg-dark-card text-primary"
            />
            <button
              onClick={handleAddSignal}
              disabled={!newSignal.message || !newSignal.suggestion}
              className="btn btn-primary text-body-large"
            >
              <Plus className="w-5 h-5" />
              Add Signal
            </button>
          </div>
        </div>

        {/* Active Signals */}
        <div className="space-y-4">
          {externalSignals.map(signal => (
            <div key={signal.id} className={`p-6 rounded-3xl border-l-4 shadow-soft ${
              signal.severity === 'high' ? 'bg-gradient-to-r from-red-50 to-red-100 border-red-400' :
              signal.severity === 'medium' ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-400' :
              'bg-gradient-to-r from-green-50 to-green-100 border-green-400'
            }`}>
              <div className="flex items-start gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-xl font-bold text-gray-900">{signal.message}</span>
                    <div className="flex items-center gap-3">
                      <span className={`px-4 py-2 rounded-2xl text-sm font-bold shadow-soft ${
                        signal.severity === 'high' ? 'bg-gradient-danger text-white' :
                        signal.severity === 'medium' ? 'bg-gradient-warning text-white' :
                        'bg-gradient-success text-white'
                      }`}>
                        {signal.severity} • {signal.type}
                      </span>
                      <div className={`p-3 rounded-2xl ${
                        signal.severity === 'high' ? 'bg-gradient-danger' :
                        signal.severity === 'medium' ? 'bg-gradient-warning' :
                        'bg-gradient-success'
                      }`}>
                        <AlertTriangle className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <p className="text-lg text-gray-700 mb-3">{signal.suggestion}</p>
                  <p className="text-sm text-gray-600 font-medium">
                    {signal.timestamp.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminControl