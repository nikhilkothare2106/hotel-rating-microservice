import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { hotelsApi } from '../api/hotels'
import { ratingsApi } from '../api/ratings'
import { usersApi } from '../api/users'
import { Loader, ErrorBanner, EmptyState } from '../components/Feedback.jsx'
import { Stars, Stamp } from '../components/StarRating.jsx'

export default function HotelDetail() {
  const { hotelId } = useParams()
  const [state, setState] = useState({ loading: true, error: '', hotel: null, ratings: [], users: {} })

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [hotel, ratings] = await Promise.all([
          hotelsApi.getById(hotelId),
          ratingsApi.getByHotelId(hotelId),
        ])
        const userIds = [...new Set(ratings.map((r) => r.userId))]
        const userEntries = await Promise.all(
          userIds.map(async (id) => {
            try {
              return [id, await usersApi.getById(id)]
            } catch {
              return [id, null]
            }
          })
        )
        if (!cancelled) {
          setState({
            loading: false,
            error: '',
            hotel,
            ratings,
            users: Object.fromEntries(userEntries),
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
  }, [hotelId])

  const { loading, error, hotel, ratings, users } = state

  if (loading) return <Loader label="Pulling up this property's file" />
  if (error) return <ErrorBanner message={error} />
  if (!hotel) return null

  const average =
    ratings.length > 0 ? ratings.reduce((sum, r) => sum + Number(r.rating || 0), 0) / ratings.length : null

  return (
    <div>
      <Link to="/hotels" className="back-link">
        ← Back to hotels
      </Link>

      <div className="detail-header">
        <div>
          <div className="page-eyebrow">Hotel {hotel.id}</div>
          <h1 className="page-title">{hotel.name}</h1>
          <p className="page-subtitle">{hotel.location}</p>
          {hotel.about && <p className="about-text" style={{ marginTop: 12 }}>{hotel.about}</p>}
        </div>
        <Stamp value={average} />
      </div>

      <h2 className="section-title">Guest reviews ({ratings.length})</h2>
      {ratings.length === 0 ? (
        <EmptyState
          title="No reviews yet"
          message={`${hotel.name} hasn't been rated yet.`}
          action={
            <Link to="/ratings" className="btn btn-primary">
              Log a rating
            </Link>
          }
        />
      ) : (
        <div className="list">
          {ratings.map((r) => {
            const user = users[r.userId]
            return (
              <div className="row-card" key={r.ratingId}>
                <div className="row-main">
                  <div className="row-title">
                    {user ? <Link to={`/guests/${user.userId}`}>{user.name}</Link> : `Guest ${r.userId}`}
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
