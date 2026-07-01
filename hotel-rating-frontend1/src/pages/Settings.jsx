import { useState } from 'react'
import { getBaseUrl, setBaseUrl, resetBaseUrl, getDefaultBaseUrl } from '../api/client'
import { usersApi } from '../api/users'
import { SuccessBanner, ErrorBanner } from '../components/Feedback.jsx'

export default function Settings() {
  const [url, setUrl] = useState(getBaseUrl())
  const [saved, setSaved] = useState('')
  const [testResult, setTestResult] = useState('')
  const [testError, setTestError] = useState('')
  const [testing, setTesting] = useState(false)

  function handleSave(e) {
    e.preventDefault()
    setBaseUrl(url)
    setSaved('Saved. New requests will use this gateway URL.')
    setTimeout(() => setSaved(''), 3000)
  }

  function handleReset() {
    resetBaseUrl()
    setUrl(getDefaultBaseUrl())
  }

  async function handleTest() {
    setTesting(true)
    setTestResult('')
    setTestError('')
    try {
      const users = await usersApi.getAll()
      setTestResult(`Connected. Found ${users.length} guest${users.length === 1 ? '' : 's'} at /users.`)
    } catch (err) {
      setTestError(err.message)
    } finally {
      setTesting(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Configuration</div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">
            Point this app at your Spring Cloud Gateway. Every request for guests, hotels, and ratings
            goes through this single base URL.
          </p>
        </div>
      </div>

      <div className="card card-pad" style={{ maxWidth: 520 }}>
        <form className="form" onSubmit={handleSave}>
          <div className="field">
            <label htmlFor="gateway">Gateway base URL</label>
            <input
              id="gateway"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="http://localhost:8765"
            />
          </div>
          <SuccessBanner message={saved} />
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-primary">Save</button>
            <button type="button" className="btn btn-ghost" onClick={handleReset}>
              Reset to default
            </button>
          </div>
        </form>

        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--color-border)' }}>
          <button className="btn btn-ghost" onClick={handleTest} disabled={testing}>
            {testing ? 'Testing…' : 'Test connection'}
          </button>
          <div style={{ marginTop: 12 }}>
            <SuccessBanner message={testResult} />
            <ErrorBanner message={testError} />
          </div>
        </div>
      </div>

      <div className="card card-pad" style={{ maxWidth: 520, marginTop: 20 }}>
        <h2 className="section-title" style={{ fontSize: 16 }}>
          Expected routes
        </h2>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
          GET/POST <code>/users</code>, GET <code>/users/&#123;userId&#125;</code>
          <br />
          GET/POST <code>/hotels</code>, GET <code>/hotels/&#123;id&#125;</code>
          <br />
          GET/POST <code>/ratings</code>, GET <code>/ratings/users/&#123;userId&#125;</code>,{' '}
          <code>/ratings/hotels/&#123;hotelId&#125;</code>
        </p>
      </div>
    </div>
  )
}
