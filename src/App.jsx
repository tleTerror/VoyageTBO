import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import BookingSimulator from './pages/BookingSimulator'
import AgentTimeline from './pages/AgentTimeline'
import AdminControl from './pages/AdminControl'
import { TrustProvider } from './context/TrustContext'

function App() {
  return (
    <TrustProvider>
      <Router>
        <div className="min-h-screen">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/simulator" element={<BookingSimulator />} />
              <Route path="/timeline/:agentId" element={<AgentTimeline />} />
              <Route path="/admin" element={<AdminControl />} />
            </Routes>
          </main>
        </div>
      </Router>
    </TrustProvider>
  )
}

export default App