import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTrust } from '../context/TrustContext'
import TrustScoreCard from '../components/TrustScoreCard'
import RiskBadge from '../components/RiskBadge'
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  CreditCard,
  Activity,
  User,
  Clock,
  BarChart3
} from 'lucide-react'
import { format } from 'date-fns'

const AgentTimeline = () => {
  const { agentId } = useParams()
  const { agents } = useTrust()
  
  const agent = agents.find(a => a.id === agentId)
  
  if (!agent) {
    return (
      <div className="text-center py-20">
        <div className="card p-12 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Agent Not Found</h2>
          <p className="text-gray-600 mb-6">The requested agent could not be found.</p>
          <Link to="/" className="btn btn-primary">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const getEventIcon = (type, decision) => {
    if (type === 'payment') {
      return <DollarSign className="w-6 h-6 text-white" />
    }
    
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
        return <Activity className="w-6 h-6 text-white" />
    }
  }

  const getEventGradient = (type, decision) => {
    if (type === 'payment') {
      return 'bg-gradient-success'
    }
    
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
      <div className="flex items-center gap-6">
        <Link to="/" className="btn btn-secondary">
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>
        <div className="flex-1">
          <h1 className="text-heading-1 text-gradient">{agent.name}</h1>
          <p className="text-body-large text-secondary mt-2">Trust timeline and activity history</p>
        </div>
      </div>

      <div className="grid grid-3 gap-8">
        {/* Agent Overview */}
        <div className="card p-8 hover-lift">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-primary rounded-2xl glow-cyan">
              <User className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-heading-3 text-primary">Agent Overview</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gradient-primary-dark rounded-2xl glow-cyan">
              <span className="text-body-large font-semibold text-primary">Risk Level</span>
              <RiskBadge level={agent.riskLevel} />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gradient-success-dark rounded-2xl glow-green">
              <span className="text-body-large font-semibold text-primary">Overall Trust</span>
              <span className="text-heading-3 font-bold text-success">{agent.trustScores.overall}</span>
            </div>
            
            <div className="p-4 bg-gradient-purple-dark rounded-2xl glow-purple">
              <div className="flex items-center justify-between mb-3">
                <span className="text-body-large font-semibold text-primary">Credit Utilization</span>
                <span className="text-body-large font-bold text-purple">
                  {Math.round((agent.creditUsed / agent.creditLimit) * 100)}%
                </span>
              </div>
              <div className="bg-white rounded-full h-4 overflow-hidden shadow-soft">
                <div 
                  className="progress-bar h-4 transition-all duration-500"
                  style={{ width: `${(agent.creditUsed / agent.creditLimit) * 100}%` }}
                />
              </div>
              <p className="text-caption text-secondary mt-2 font-medium">
                ${agent.creditUsed.toLocaleString()} / ${agent.creditLimit.toLocaleString()}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="space-y-3">
                <div>
                  <p className="text-caption text-secondary font-medium mb-1">Contact Email</p>
                  <p className="text-body-large font-semibold text-primary">{agent.email}</p>
                </div>
                <div>
                  <p className="text-caption text-secondary font-medium mb-1">Last Activity</p>
                  <p className="text-body-large font-semibold text-primary">{format(agent.lastActivity, 'MMM dd, yyyy HH:mm')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Scores */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-success rounded-2xl glow-green">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-heading-3 text-primary">Trust Scores</h2>
          </div>
          <TrustScoreCard 
            title="Financial Trust" 
            score={agent.trustScores.financial}
            change={agent.timeline[0]?.trustChange?.financial || 0}
          />
          <TrustScoreCard 
            title="Behavior Trust" 
            score={agent.trustScores.behavior}
            change={agent.timeline[0]?.trustChange?.behavior || 0}
          />
          <TrustScoreCard 
            title="History Trust" 
            score={agent.trustScores.history}
            change={agent.timeline[0]?.trustChange?.history || 0}
          />
        </div>

        {/* Quick Stats */}
        <div className="card p-8 hover-lift">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-warning rounded-2xl glow-orange">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-heading-3 text-primary">Activity Stats</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gradient-primary-dark rounded-2xl glow-cyan">
              <span className="text-body-large font-semibold text-primary">Total Events</span>
              <span className="text-heading-4 font-bold text-accent">{agent.timeline.length}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gradient-success-dark rounded-2xl glow-green">
              <span className="text-body-large font-semibold text-primary">Bookings</span>
              <span className="text-heading-4 font-bold text-success">
                {agent.timeline.filter(e => e.type === 'booking').length}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gradient-purple-dark rounded-2xl glow-purple">
              <span className="text-body-large font-semibold text-primary">Payments</span>
              <span className="text-heading-4 font-bold text-purple">
                {agent.timeline.filter(e => e.type === 'payment').length}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gradient-warning-dark rounded-2xl glow-orange">
              <span className="text-body-large font-semibold text-primary">Flagged Events</span>
              <span className="text-heading-4 font-bold text-warning">
                {agent.timeline.filter(e => e.decision === 'flagged').length}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gradient-danger-dark rounded-2xl glow-red">
              <span className="text-body-large font-semibold text-primary">Blocked Events</span>
              <span className="text-heading-4 font-bold text-danger">
                {agent.timeline.filter(e => e.decision === 'blocked').length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="card p-8 hover-lift">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-gradient-primary rounded-2xl glow-cyan">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-heading-2 text-primary">Activity Timeline</h2>
        </div>
        
        {agent.timeline.length === 0 ? (
          <div className="text-center py-16">
            <div className="p-6 bg-gradient-primary-dark rounded-3xl max-w-md mx-auto glow-cyan">
              <Calendar className="w-16 h-16 text-accent mx-auto mb-4" />
              <p className="text-heading-4 text-primary font-medium">No activity recorded yet</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {agent.timeline.map((event, index) => (
              <div key={event.id} className="relative">
                {/* Timeline line */}
                {index < agent.timeline.length - 1 && (
                  <div className="absolute left-8 top-20 w-1 h-20 bg-gradient-primary rounded-full opacity-30" />
                )}
                
                <div className="flex gap-6 p-6 bg-gradient-primary-dark rounded-3xl shadow-dark hover:shadow-strong transition-all duration-300 hover:glow-cyan">
                  {/* Icon */}
                  <div className={`flex-shrink-0 p-4 rounded-3xl shadow-dark ${getEventGradient(event.type, event.decision)}`}>
                    {getEventIcon(event.type, event.decision)}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-heading-4 text-primary mb-2">{event.description}</h3>
                        <p className="text-body text-secondary mb-3">{event.reason}</p>
                        <p className="text-caption text-muted font-medium">
                          {format(event.timestamp, 'MMM dd, yyyy HH:mm')}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        {event.amount && (
                          <p className="text-heading-3 font-bold text-accent mb-2">
                            ${event.amount.toLocaleString()}
                          </p>
                        )}
                        <span className={`px-4 py-2 rounded-2xl text-caption font-bold shadow-dark ${
                          event.decision === 'approved' ? 'bg-gradient-success text-white' :
                          event.decision === 'flagged' ? 'bg-gradient-warning text-white' :
                          event.decision === 'blocked' ? 'bg-gradient-danger text-white' :
                          'bg-gradient-primary text-white'
                        }`}>
                          {event.decision?.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    
                    {/* Trust Changes */}
                    {event.trustChange && (
                      <div className="mt-6 pt-4 border-t border-slate-600">
                        <p className="text-caption text-secondary font-semibold mb-3">Trust Score Changes:</p>
                        <div className="flex gap-6">
                          {Object.entries(event.trustChange).map(([type, change]) => (
                            change !== 0 && (
                              <div key={type} className="flex items-center gap-2 p-2 bg-dark-card rounded-2xl shadow-dark">
                                {change > 0 ? (
                                  <div className="p-1 bg-gradient-success rounded-full">
                                    <TrendingUp className="w-4 h-4 text-white" />
                                  </div>
                                ) : (
                                  <div className="p-1 bg-gradient-danger rounded-full">
                                    <TrendingDown className="w-4 h-4 text-white" />
                                  </div>
                                )}
                                <span className="text-caption font-medium capitalize text-primary">{type}:</span>
                                <span className={`text-caption font-bold ${
                                  change > 0 ? 'text-success' : 'text-danger'
                                }`}>
                                  {change > 0 ? '+' : ''}{change}
                                </span>
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Signals */}
                    {event.signals && event.signals.length > 0 && (
                      <div className="mt-6 pt-4 border-t border-slate-600">
                        <p className="text-caption text-secondary font-semibold mb-3">Risk Signals:</p>
                        <div className="flex flex-wrap gap-3">
                          {event.signals.map((signal, signalIndex) => (
                            <span key={signalIndex} className={`px-3 py-2 rounded-2xl text-caption font-bold shadow-dark ${
                              signal.severity === 'high' ? 'bg-gradient-danger text-white' :
                              signal.severity === 'medium' ? 'bg-gradient-warning text-white' :
                              'bg-gradient-primary text-white'
                            }`}>
                              {signal.type.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AgentTimeline