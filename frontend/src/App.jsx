import React, { useState, useRef, useEffect } from 'react'
import './App.css'
import PaymentComponent from './PaymentComponent'
import { API_BASE_URL } from './config'

function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [usageStats, setUsageStats] = useState(null)
  const [pricingTiers, setPricingTiers] = useState(null)
  const [showPricing, setShowPricing] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const messagesEndRef = useRef(null)

  const userId = 'demo-user' // In a real app, this would come from authentication

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Load pricing tiers on component mount
    fetchPricingTiers()
    fetchUserStats()
  }, [])

  const fetchPricingTiers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/pricing`)
      if (response.ok) {
        const data = await response.json()
        setPricingTiers(data.tiers)
      }
    } catch (err) {
      console.error('Error fetching pricing tiers:', err)
    }
  }

  const fetchUserStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${userId}/stats`)
      if (response.ok) {
        const data = await response.json()
        setUsageStats(data)
      }
    } catch (err) {
      console.error('Error fetching user stats:', err)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = { role: 'user', content: input }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages,
          userId: userId
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send message')
      }

      const data = await response.json()
      const assistantMessage = { role: 'assistant', content: data.message }
      setMessages([...newMessages, assistantMessage])
      
      // Update usage stats
      fetchUserStats()
    } catch (err) {
      setError(err.message)
      console.error('Error sending message:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleUpgrade = (newTier) => {
    setShowPayment(false)
    // In a real app, this would update the user's tier in the backend
    alert(`Successfully upgraded to ${newTier}!`)
    fetchUserStats() // Refresh stats
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🤖 AI Chat Pro</h1>
        <div className="header-actions">
          <button 
            className="pricing-btn"
            onClick={() => setShowPricing(true)}
          >
            Pricing
          </button>
          {usageStats && (
            <div className="usage-stats">
              <span>Tokens: {usageStats.remainingTokens?.toLocaleString() || '0'}</span>
              <span>Tier: {usageStats.currentTier || 'Free'}</span>
            </div>
          )}
        </div>
      </header>

      <div className="chat-container">
        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="welcome-message">
              <h2>Welcome to AI Chat Pro!</h2>
              <p>Ask me anything and I'll help you with intelligent responses powered by advanced AI.</p>
              <div className="example-prompts">
                <h3>Try asking:</h3>
                <ul>
                  <li>"Explain quantum computing in simple terms"</li>
                  <li>"Write a Python function to sort a list"</li>
                  <li>"Help me plan a healthy meal for the week"</li>
                </ul>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className={`message ${message.role}`}>
                <div className="message-content">
                  {message.content}
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="message assistant">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="input-container">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here... (Press Enter to send)"
            disabled={isLoading}
            rows={3}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="send-btn"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>

      {/* Pricing Modal */}
      {showPricing && (
        <div className="pricing-modal">
          <div className="pricing-content">
            <h2>Choose Your Plan</h2>
            
            <div className="pricing-tiers">
              {pricingTiers && pricingTiers.map(tier => (
                <div key={tier.id} className="pricing-tier">
                  <h3>{tier.name}</h3>
                  <div className="price">${tier.monthlyCost}/month</div>
                  <div className="description">{tier.description}</div>
                  
                  <ul className="features">
                    <li>{tier.tokens.toLocaleString()} tokens per month</li>
                    <li>{tier.features}</li>
                  </ul>
                  
                  {tier.id !== 'free' && (
                    <button 
                      className="upgrade-tier-btn"
                      onClick={() => {
                        setShowPricing(false)
                        setShowPayment(true)
                      }}
                    >
                      Upgrade to {tier.name}
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <button 
              className="close-pricing-btn"
              onClick={() => setShowPricing(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      <PaymentComponent
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        onUpgrade={handleUpgrade}
      />
    </div>
  )
}

export default App