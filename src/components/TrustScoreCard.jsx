import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const TrustScoreCard = ({ title, score, change, color = 'blue' }) => {
  const getCardClasses = (score) => {
    if (score >= 80) return 'card-gradient-green glow-green'
    if (score >= 60) return 'card-gradient-orange glow-orange'
    return 'card-gradient-danger glow-red'
  }

  const getTrendIcon = () => {
    if (change > 0) return <TrendingUp className="w-5 h-5 text-green-300" />
    if (change < 0) return <TrendingDown className="w-5 h-5 text-red-300" />
    return <Minus className="w-5 h-5 text-gray-400" />
  }

  const getProgressColor = (score) => {
    if (score >= 80) return 'progress-bar-green'
    if (score >= 60) return 'progress-bar-orange'
    return 'bg-gradient-to-r from-red-500 to-red-600'
  }

  return (
    <div className={`card p-6 hover-lift animate-fadeInUp ${getCardClasses(score)}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-body-large font-semibold text-white opacity-90">{title}</h3>
        <div className="p-2 bg-white bg-opacity-20 rounded-full">
          {getTrendIcon()}
        </div>
      </div>
      
      <div className="flex items-end gap-3 mb-4">
        <span className="text-heading-1 font-bold text-white">{score}</span>
        <span className="text-body-large text-white opacity-75 mb-2">/ 100</span>
      </div>
      
      {change !== 0 && (
        <div className="mb-4">
          <span className={`text-caption font-medium px-3 py-1 rounded-full ${
            change > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {change > 0 ? '+' : ''}{change} from last update
          </span>
        </div>
      )}
      
      <div className="bg-white bg-opacity-30 rounded-full h-3 overflow-hidden">
        <div 
          className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )
}

export default TrustScoreCard