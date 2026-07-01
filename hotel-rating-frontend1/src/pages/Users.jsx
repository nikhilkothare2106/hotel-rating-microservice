import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usersApi } from '../api/users'
import { Loader, ErrorBanner, SuccessBanner, EmptyState } from '../components/Feedback.jsx'

const emptyForm = { name: '', email: '', about: '' }

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  function load() {
    setLoading(true)
    setError('')
    usersApi
      .getAll()
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')
    try {
      const created = await usersApi.create(form)
      setForm(emptyForm)
      setSuccess(`Registered ${created.name || 'guest'}.`)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Registry</div>
          <h1 className="page-title">Guests</h1>
          <p className="page-subtitle">Everyone who has an account and can leave a hotel rating.</p>
        </div>
      </div>

      <div className="two-col">
        <div>
          <ErrorBanner message={error} />
          {loading ? (
            <Loader label="Fetching guests" />
          ) : users.length === 0 ? (
            <EmptyState title="No guests yet" message="Add the first guest using the form on the right." />
          ) : (
            <div className="list">
              {users.map((u) => (
                <div
                  className="row-card clickable"
                  key={u.userId}
                  onClick={() => navigate(`/guests/${u.userId}`)}
                >
                  <div className="row-main">
                    <div className="row-title">{u.name}</div>
                    <div className="row-sub">{u.email}</div>
                  </div>
                  <div className="row-meta">
                    <span className="pill">{u.userId}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card card-pad">
          <h2 className="section-title">Register a guest</h2>
          <SuccessBanner message={success} />
          <form className="form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="about">About</label>
              <textarea
                id="about"
                rows={3}
                value={form.about}
                onChange={(e) => setForm({ ...form, about: e.target.value })}
              />
            </div>
            <button className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Registering…' : 'Register guest'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
