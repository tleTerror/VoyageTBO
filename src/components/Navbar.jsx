import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Shield, BarChart3, Users, Settings } from 'lucide-react'

const Navbar = () => {
  const location = useLocation()
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: BarChart3 },
    { path: '/simulator', label: 'Booking Simulator', icon: Users },
    { path: '/admin', label: 'Admin Control', icon: Settings }
  ]

  return (
    <nav className="bg-dark-card shadow-dark border-b border-slate-700 sticky top-0 z-50 backdrop-filter backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-primary rounded-3xl shadow-dark glow-cyan">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-heading-4 text-primary">TBO Trust System</h1>
              <p className="text-caption text-secondary">Adaptive Credit Decision Engine</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-caption font-semibold transition-all duration-300 ${
                  location.pathname === path
                    ? 'bg-gradient-primary text-white shadow-dark glow-cyan transform scale-105'
                    : 'text-secondary hover:text-primary hover:bg-dark-card hover:transform hover:scale-105'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar