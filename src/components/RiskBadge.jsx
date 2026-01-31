import React from 'react'
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react'

const RiskBadge = ({ level, size = 'md' }) => {
  const configs = {
    low: {
      icon: CheckCircle,
      text: 'Low Risk',
      classes: 'bg-gradient-success text-white shadow-dark glow-green'
    },
    medium: {
      icon: AlertCircle,
      text: 'Medium Risk',
      classes: 'bg-gradient-warning text-white shadow-dark glow-orange'
    },
    high: {
      icon: AlertTriangle,
      text: 'High Risk',
      classes: 'bg-gradient-danger text-white shadow-dark glow-red'
    }
  }

  const config = configs[level] || configs.low
  const Icon = config.icon
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }

  return (
    <span className={`inline-flex items-center gap-2 rounded-full font-semibold transition-all duration-300 hover:scale-105 ${config.classes} ${sizeClasses[size]}`}>
      <Icon className={`${size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'}`} />
      {config.text}
    </span>
  )
}

export default RiskBadge