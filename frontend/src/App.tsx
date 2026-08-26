import { useState, useEffect } from 'react'

function App() {
  const [healthStatus, setHealthStatus] = useState<string>('Checking...')

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setHealthStatus(`${data.service}: ${data.status}`)
      })
      .catch((err) => {
        setHealthStatus('Error connecting to backend')
        console.error(err)
      })
  }, [])

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Revenue Leakage Detective</h1>
      <p>Backend Status: <strong>{healthStatus}</strong></p>
    </div>
  )
}

export default App
