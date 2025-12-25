import axios from 'axios'
import { useState, useEffect } from 'react'

// --- DASHBOARD COMPONENT ---
function Dashboard({ user }) {
  const [projects, setProjects] = useState([])
  const [projectName, setProjectName] = useState('')
  const token = localStorage.getItem('token')

  // Fetch projects for the logged-in tenant
  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/projects', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data.success) setProjects(res.data.data)
    } catch (err) {
      console.error("Error fetching projects", err)
    }
  }

  // Create project tied to this tenant_id
  const handleCreateProject = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:5000/api/projects', 
        { name: projectName, description: 'Demo Project' },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setProjectName('')
      fetchProjects() // Refresh list to show isolation
    } catch (err) {
      alert("Failed to create project")
    }
  }

  useEffect(() => { fetchProjects() }, [])

  return (
    <div style={{ marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
      <h3>Project Management</h3>
      <form onSubmit={handleCreateProject} style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="New Project Name" 
          value={projectName} 
          onChange={(e) => setProjectName(e.target.value)}
          required
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '8px 15px' }}>Create Project</button>
      </form>

      <h4>Your Tenant Projects:</h4>
      {projects.length === 0 ? <p>No projects found for this tenant.</p> : (
        <ul>
          {projects.map(proj => (
            <li key={proj.id}><strong>{proj.name}</strong> (ID: {proj.id})</li>
          ))}
        </ul>
      )}
    </div>
  )
}

// --- MAIN APP COMPONENT ---
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
        'http://localhost:5000/api/auth/login',
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
      <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: 'auto' }}>
        <h1 style={{ color: 'green' }}>✓ Login Successful!</h1>
        <div style={{ backgroundColor: '#f4f4f4', padding: '15px', borderRadius: '5px' }}>
            <p><strong>User:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Tenant ID:</strong> {user.tenantId || 'Super Admin (No Tenant)'}</p>
            <button 
                onClick={() => { setUser(null); localStorage.removeItem('token') }}
                style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '10px', cursor: 'pointer' }}
            >
                Logout
            </button>
        </div>

        {/* Integrated Dashboard for Projects */}
        <Dashboard user={user} />
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
    </div>
  )
}