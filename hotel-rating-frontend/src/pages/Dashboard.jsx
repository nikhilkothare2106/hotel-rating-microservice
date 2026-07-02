import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { usersApi } from '../api/users'
import { hotelsApi } from '../api/hotels'
import { ratingsApi } from '../api/ratings'
import { Loader, ErrorBanner, EmptyState } from '../components/Feedback.jsx'
import { Stars } from '../components/StarRating.jsx'

export default function Dashboard() {
  const [state, setState] = useState({ loading: true, error: '', users: [], hotels: [], ratings: [] })

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [users, hotels, ratings] = await Promise.all([
          usersApi.getAll(),
          hotelsApi.getAll(),
          ratingsApi.getAll(),
        ])
        if (!cancelled) setState({ loading: false, error: '', users, hotels, ratings })
      } catch (err) {
        if (!cancelled) setState((s) => ({ ...s, loading: false, error: err.message }))
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const { loading, error, users, hotels, ratings } = state

  const userById = Object.fromEntries(users.map((u) => [u.userId, u]))
  const hotelById = Object.fromEntries(hotels.map((h) => [h.hotelId, h]))

  const recent = [...ratings]
    .sort((a, b) => (b.ratingId || '').localeCompare(a.ratingId || ''))
    .slice(0, 6)

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Front desk</div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            A running register of every guest, hotel, and rating logged through the gateway.
          </p>
        </div>
      </div>

      <ErrorBanner message={error} />

      {loading ? (
        <Loader label="Reading the ledger" />
      ) : (
        <>
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-value">{users.length}</div>
              <div className="stat-label">Guests registered</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{hotels.length}</div>
              <div className="stat-label">Hotels listed</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{ratings.length}</div>
              <div className="stat-label">Ratings logged</div>
            </div>
          </div>

          <h2 className="section-title">Latest ratings</h2>
          {recent.length === 0 ? (
            <EmptyState
              title="No ratings yet"
              message="Once guests start rating hotels, the most recent entries will show up here."
              action={
                <Link to="/ratings" className="btn btn-primary">
                  Log a rating
                </Link>
              }
            />
          ) : (
            <div className="list">
              {recent.map((r) => {
                const hotel = hotelById[r.hotelId]
                const user = userById[r.userId]
                console.log(hotel)
                return (
                  <div className="row-card" key={r.ratingId}>
                    <div className="row-main">
                      <div className="row-title">{hotel ? hotel.name : `Hotel ${r.name}`}</div>
                      <div className="row-sub">
                        rated by {user ? user.name : `guest ${r.userId}`}
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
        </>
      )}
    </div>
  )
}
