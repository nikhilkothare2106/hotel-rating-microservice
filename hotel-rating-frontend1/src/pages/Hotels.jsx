import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { hotelsApi } from '../api/hotels'
import { Loader, ErrorBanner, SuccessBanner, EmptyState } from '../components/Feedback.jsx'

const emptyForm = { name: '', location: '', about: '' }

export default function Hotels() {
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  function load() {
    setLoading(true)
    setError('')
    hotelsApi
      .getAll()
      .then(setHotels)
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
      const created = await hotelsApi.create(form)
      setForm(emptyForm)
      setSuccess(`Listed ${created.name || 'hotel'}.`)
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
          <div className="page-eyebrow">Directory</div>
          <h1 className="page-title">Hotels</h1>
          <p className="page-subtitle">Every property listed for guests to rate.</p>
        </div>
      </div>

      <div className="two-col">
        <div>
          <ErrorBanner message={error} />
          {loading ? (
            <Loader label="Fetching hotels" />
          ) : hotels.length === 0 ? (
            <EmptyState title="No hotels yet" message="Add the first property using the form on the right." />
          ) : (
            <div className="list">
              {hotels.map((h) => (
                <div
                  className="row-card clickable"
                  key={h.id}
                  onClick={() => navigate(`/hotels/${h.id}`)}
                >
                  <div className="row-main">
                    <div className="row-title">{h.name}</div>
                    <div className="row-sub">{h.location}</div>
                  </div>
                  <div className="row-meta">
                    <span className="pill">{h.id}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card card-pad">
          <h2 className="section-title">List a hotel</h2>
          <SuccessBanner message={success} />
          <form className="form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="hname">Name</label>
              <input
                id="hname"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                required
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="habout">About</label>
              <textarea
                id="habout"
                rows={3}
                value={form.about}
                onChange={(e) => setForm({ ...form, about: e.target.value })}
              />
            </div>
            <button className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Listing…' : 'List hotel'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
