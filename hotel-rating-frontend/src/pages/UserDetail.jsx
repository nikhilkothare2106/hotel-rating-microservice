import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { usersApi } from '../api/users'
import { ratingsApi } from '../api/ratings'
import { hotelsApi } from '../api/hotels'
import { Loader, ErrorBanner, EmptyState } from '../components/Feedback.jsx'
import { Stars } from '../components/StarRating.jsx'

export default function UserDetail() {
  const { userId } = useParams()
  const [state, setState] = useState({ loading: true, error: '', user: null, ratings: [], hotels: {} })

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [user, ratings] = await Promise.all([
          usersApi.getById(userId),
          ratingsApi.getByUserId(userId),
        ])
        const hotelIds = [...new Set(ratings.map((r) => r.hotelId))]
        const hotelEntries = await Promise.all(
          hotelIds.map(async (id) => {
            try {
              return [id, await hotelsApi.getById(id)]
            } catch {
              return [id, null]
            }
          })
        )
        if (!cancelled) {
          setState({
            loading: false,
            error: '',
            user,
            ratings,
            hotels: Object.fromEntries(hotelEntries),
          })
        }
      } catch (err) {
        if (!cancelled) setState((s) => ({ ...s, loading: false, error: err.message }))
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [userId])

  const { loading, error, user, ratings, hotels } = state

  if (loading) return <Loader label="Pulling up this guest's record" />
  if (error) return <ErrorBanner message={error} />
  if (!user) return null

  return (
    <div>
      <Link to="/guests" className="back-link">
        ← Back to guests
      </Link>

      <div className="detail-header">
        <div>
          <div className="page-eyebrow">Guest {user.userId}</div>
          <h1 className="page-title">{user.name}</h1>
          <p className="page-subtitle">{user.email}</p>
          {user.about && <p className="about-text" style={{ marginTop: 12 }}>{user.about}</p>}
        </div>
      </div>

      <h2 className="section-title">Ratings left by {user.name}</h2>
      {ratings.length === 0 ? (
        <EmptyState
          title="No ratings yet"
          message={`${user.name} hasn't rated a hotel yet.`}
          action={
            <Link to="/ratings" className="btn btn-primary">
              Log a rating
            </Link>
          }
        />
      ) : (
        <div className="list">
          {ratings.map((r) => {
            const hotel = hotels[r.hotelId]
            return (
              <div className="row-card" key={r.ratingId}>
                <div className="row-main">
                  <div className="row-title">
                    {hotel ? (
                      <Link to={`/hotels/${hotel.id}`}>{hotel.name}</Link>
                    ) : (
                      `Hotel ${r.hotelId}`
                    )}
                  </div>
                  {r.feedback && <div className="row-sub">"{r.feedback}"</div>}
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
  )
}
