import React from 'react'
import { Link } from 'react-router-dom'
import { useTrust } from '../context/TrustContext'
import TrustScoreCard from '../components/TrustScoreCard'
import RiskBadge from '../components/RiskBadge'
import { 
  Users, 
  DollarSign, 
  AlertTriangle, 
  TrendingUp,
  Eye,
  Clock,
  CreditCard,
  Activity,
  Zap,
  Shield
} from 'lucide-react'
import { format } from 'date-fns'

const Dashboard = () => {
  const { agents, globalRiskMode, externalSignals } = useTrust()

  const totalAgents = agents.length
  const totalCreditLimit = agents.reduce((sum, agent) => sum + agent.creditLimit, 0)
  const totalCreditUsed = agents.reduce((sum, agent) => sum + agent.creditUsed, 0)
  const highRiskAgents = agents.filter(agent => agent.riskLevel === 'high').length
  const avgTrustScore = Math.round(
    agents.reduce((sum, agent) => sum + agent.trustScores.overall, 0) / agents.length
  )

  const recentActivity = agents
    .flatMap(agent => 
      agent.timeline.map(event => ({
        ...event,
        agentName: agent.name,
        agentId: agent.id
      }))
    )
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <h1 className="text-heading-1 text-gradient">Trust Dashboard</h1>
          <p className="text-body-large text-secondary">Real-time agent trust monitoring and risk assessment</p>
        </div>
        <div className="flex items-center gap-4 p-6 bg-dark-card rounded-3xl shadow-dark">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-accent" />
            <span className="text-body text-secondary">Risk Mode:</span>
          </div>
          <span className={`px-6 py-3 rounded-2xl text-caption font-bold shadow-dark ${
            globalRiskMode === 'conservative' ? 'bg-gradient-danger text-white glow-red' :
            globalRiskMode === 'growth' ? 'bg-gradient-success text-white glow-green' :
            'bg-gradient-primary text-white glow-cyan'
          }`}>
            {globalRiskMode.charAt(0).toUpperCase() + globalRiskMode.slice(1)}
          </span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-4 gap-6">
        <div className="card card-gradient-cyan p-8 hover-lift animate-fadeInUp glow-cyan">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white bg-opacity-20 rounded-3xl">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-body-large text-white opacity-90 font-medium">Total Agents</p>
              <p className="text-heading-1 font-bold text-white">{totalAgents}</p>
            </div>
          </div>
        </div>

        <div className="card card-gradient-green p-8 hover-lift animate-fadeInUp glow-green">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white bg-opacity-20 rounded-3xl">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-body-large text-white opacity-90 font-medium">Credit Utilization</p>
              <p className="text-heading-1 font-bold text-white">
                {Math.round((totalCreditUsed / totalCreditLimit) * 100)}%
              </p>
              <p className="text-caption text-white opacity-75 mt-1">
                ${totalCreditUsed.toLocaleString()} / ${totalCreditLimit.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="card card-gradient-orange p-8 hover-lift animate-fadeInUp glow-orange">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white bg-opacity-20 rounded-3xl">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-body-large text-white opacity-90 font-medium">High Risk Agents</p>
              <p className="text-heading-1 font-bold text-white">{highRiskAgents}</p>
            </div>
          </div>
        </div>

        <div className="card card-gradient-purple p-8 hover-lift animate-fadeInUp glow-purple">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white bg-opacity-20 rounded-3xl">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-body-large text-white opacity-90 font-medium">Avg Trust Score</p>
              <p className="text-heading-1 font-bold text-white">{avgTrustScore}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-2 gap-8">
        {/* Agents Overview */}
        <div className="card p-8 hover-lift">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-heading-3 text-primary">Agent Overview</h2>
            <Link to="/simulator" className="btn btn-primary">
              <Zap className="w-5 h-5" />
              Simulate Booking
            </Link>
          </div>
          
          <div className="space-y-6">
            {agents.map(agent => (
              <div key={agent.id} className="flex items-center justify-between p-6 bg-gradient-primary-dark rounded-3xl hover:shadow-dark transition-all duration-300 hover:glow-cyan">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <h3 className="text-heading-4 text-primary">{agent.name}</h3>
                    <RiskBadge level={agent.riskLevel} size="sm" />
                  </div>
                  <div className="flex items-center gap-6 text-caption text-secondary">
                    <span className="flex items-center gap-2 font-medium">
                      <CreditCard className="w-4 h-4" />
                      ${agent.creditUsed.toLocaleString()} / ${agent.creditLimit.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-2 font-medium">
                      <Clock className="w-4 h-4" />
                      {format(agent.lastActivity, 'MMM dd, HH:mm')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-caption text-secondary font-medium">Trust Score</p>
                    <p className="text-heading-3 text-accent font-bold">{agent.trustScores.overall}</p>
                  </div>
                  <Link 
                    to={`/timeline/${agent.id}`}
                    className="btn btn-secondary"
                  >
                    <Eye className="w-4 h-4" />
                    View Timeline
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity & External Signals */}
        <div className="space-y-8">
          {/* Recent Activity */}
          <div className="card p-8 hover-lift">
            <h2 className="text-heading-3 text-primary mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map(activity => (
                <div key={`${activity.agentId}-${activity.id}`} className="flex items-start gap-4 p-4 bg-gradient-primary-dark rounded-3xl hover:shadow-dark transition-all duration-300 hover:glow-cyan">
                  <div className={`p-3 rounded-full shadow-dark ${
                    activity.decision === 'approved' ? 'bg-gradient-success glow-green' :
                    activity.decision === 'flagged' ? 'bg-gradient-warning glow-orange' :
                    activity.decision === 'blocked' ? 'bg-gradient-danger glow-red' : 'bg-gradient-primary glow-cyan'
                  }`}>
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-body-large font-bold text-primary">{activity.agentName}</p>
                    <p className="text-body text-secondary font-medium">{activity.description}</p>
                    <p className="text-small text-muted mt-2 font-medium">
                      {format(activity.timestamp, 'MMM dd, HH:mm')} • {activity.decision}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-body-large font-bold text-accent">${activity.amount?.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* External Signals */}
          <div className="card p-8 hover-lift">
            <h2 className="text-heading-3 text-primary mb-6">External Market Signals</h2>
            <div className="space-y-4">
              {externalSignals.map(signal => (
                <div key={signal.id} className={`p-6 rounded-3xl border-l-4 shadow-dark ${
                  signal.severity === 'high' ? 'bg-gradient-danger-dark border-red-400 glow-red' :
                  signal.severity === 'medium' ? 'bg-gradient-warning-dark border-yellow-400 glow-orange' :
                  'bg-gradient-success-dark border-green-400 glow-green'
                }`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-body-large text-primary">{signal.message}</p>
                      <p className="text-body text-secondary mt-2 font-medium">{signal.suggestion}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-2xl text-caption font-bold shadow-dark ${
                      signal.severity === 'high' ? 'bg-gradient-danger text-white' :
                      signal.severity === 'medium' ? 'bg-gradient-warning text-white' :
                      'bg-gradient-success text-white'
                    }`}>
                      {signal.severity}
                    </span>
                  </div>
                  <p className="text-small text-muted mt-4 font-medium">
                    {format(signal.timestamp, 'MMM dd, HH:mm')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard