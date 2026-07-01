import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ratingsApi } from '../api/ratings'
import { usersApi } from '../api/users'
import { hotelsApi } from '../api/hotels'
import { Loader, ErrorBanner, SuccessBanner, EmptyState } from '../components/Feedback.jsx'
import { Stars, StarPicker } from '../components/StarRating.jsx'

const emptyForm = { userId: '', hotelId: '', rating: 0, feedback: '' }

export default function Ratings() {
  const [ratings, setRatings] = useState([])
  const [users, setUsers] = useState([])
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')

  function load() {
    setLoading(true)
    setError('')
    Promise.all([ratingsApi.getAll(), usersApi.getAll(), hotelsApi.getAll()])
      .then(([r, u, h]) => {
        setRatings(r)
        setUsers(u)
        setHotels(h)
        setForm((f) => ({
          ...f,
          userId: f.userId || u[0]?.userId || '',
          hotelId: f.hotelId || h[0]?.id || '',
        }))
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const userById = Object.fromEntries(users.map((u) => [u.userId, u]))
  const hotelById = Object.fromEntries(hotels.map((h) => [h.id, h]))

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.userId || !form.hotelId || !form.rating) {
      setError('Choose a guest, a hotel, and a star rating before saving.')
      return
    }
    setSubmitting(true)
    setError('')
    setSuccess('')
    try {
      await ratingsApi.create({
        userId: form.userId,
        hotelId: form.hotelId,
        rating: form.rating,
        feedback: form.feedback,
      })
      setSuccess('Rating logged.')
      setForm((f) => ({ ...f, rating: 0, feedback: '' }))
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const canCreate = users.length > 0 && hotels.length > 0

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Guestbook</div>
          <h1 className="page-title">Ratings</h1>
          <p className="page-subtitle">Every star rating and note a guest has left for a hotel.</p>
        </div>
      </div>

      <div className="two-col">
        <div>
          <ErrorBanner message={error} />
          {loading ? (
            <Loader label="Fetching ratings" />
          ) : ratings.length === 0 ? (
            <EmptyState title="No ratings yet" message="Log the first one using the form on the right." />
          ) : (
            <div className="list">
              {ratings.map((r) => {
                const user = userById[r.userId]
                const hotel = hotelById[r.hotelId]
                return (
                  <div className="row-card" key={r.ratingId}>
                    <div className="row-main">
                      <div className="row-title">
                        {hotel ? <Link to={`/hotels/${hotel.id}`}>{hotel.name}</Link> : `Hotel ${r.hotelId}`}
                      </div>
                      <div className="row-sub">
                        by {user ? <Link to={`/guests/${user.userId}`}>{user.name}</Link> : `guest ${r.userId}`}
                        {r.feedback ? ` — "${r.feedback}"` : ''}
                      </div>
                    </div>
                    <div className="row-meta">
                      <Stars value={r.rating} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="card card-pad">
          <h2 className="section-title">Log a rating</h2>
          <SuccessBanner message={success} />
          {!loading && !canCreate ? (
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
              You need at least one guest and one hotel before you can log a rating.
            </p>
          ) : (
            <form className="form" onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="userId">Guest</label>
                <select
                  id="userId"
                  value={form.userId}
                  onChange={(e) => setForm({ ...form, userId: e.target.value })}
                >
                  {users.map((u) => (
                    <option key={u.userId} value={u.userId}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="hotelId">Hotel</label>
                <select
                  id="hotelId"
                  value={form.hotelId}
                  onChange={(e) => setForm({ ...form, hotelId: e.target.value })}
                >
                  {hotels.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Rating</label>
                <StarPicker value={form.rating} onChange={(n) => setForm({ ...form, rating: n })} />
              </div>
              <div className="field">
                <label htmlFor="feedback">Feedback</label>
                <textarea
                  id="feedback"
                  rows={3}
                  value={form.feedback}
                  onChange={(e) => setForm({ ...form, feedback: e.target.value })}
                />
              </div>
              <button className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving…' : 'Save rating'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
