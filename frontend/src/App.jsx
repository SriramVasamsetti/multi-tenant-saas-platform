import axios from 'axios'
import { useState } from 'react'

export default function App() {
  const [email, setEmail] = useState('admin@demo.com')
  const [password, setPassword] = useState('Demo@123')
  const [subdomain, setSubdomain] = useState('demo')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const response = await axios.post(
        'http://backend:5000/api/auth/login',
        { email, password, tenantSubdomain: subdomain }
      )
      setUser(response.data.data.user)
      localStorage.setItem('token', response.data.data.token)
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  if (user) {
    return (
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <h1>✓ Login Successful!</h1>
        <p><strong>User:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Tenant:</strong> {user.tenantId}</p>
        <button onClick={() => { setUser(null); localStorage.removeItem('token') }}>
          Logout
        </button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h1>Multi-Tenant SaaS Login</h1>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '10px' }}>
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label>Subdomain:</label>
          <input 
            type="text" 
            value={subdomain} 
            onChange={(e) => setSubdomain(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <hr />
      <h3>Test Credentials:</h3>
      <p>
        <strong>Admin:</strong><br/>
        Email: admin@demo.com<br/>
        Password: Demo@123<br/>
        Subdomain: demo
      </p>
      <p>
        <strong>User:</strong><br/>
        Email: user1@demo.com<br/>
        Password: User@123<br/>
        Subdomain: demo
      </p>
    </div>
  )
}
