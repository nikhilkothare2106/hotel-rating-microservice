export function Loader({ label = 'Fetching from the ledger' }) {
  return (
    <div className="loader" role="status">
      <span className="loader-dot" />
      <span className="loader-dot" />
      <span className="loader-dot" />
      {label}…
    </div>
  )
}

export function EmptyState({ title, message, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-title">{title}</div>
      <p style={{ margin: '0 0 16px', fontSize: 13 }}>{message}</p>
      {action}
    </div>
  )
}

export function ErrorBanner({ message }) {
  if (!message) return null
  return <div className="banner banner-error">{message}</div>
}

export function SuccessBanner({ message }) {
  if (!message) return null
  return <div className="banner banner-success">{message}</div>
}
