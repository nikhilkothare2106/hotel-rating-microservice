export function Stars({ value = 0, max = 5 }) {
  const rounded = Math.round(value)
  return (
    <span className="stars" aria-label={`${value} out of ${max} stars`}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={i < rounded ? '' : 'dim'}>
          ★
        </span>
      ))}
    </span>
  )
}

export function Stamp({ value, small }) {
  const display = value === null || value === undefined || Number.isNaN(value) ? '—' : value.toFixed(1)
  return (
    <div className={'stamp' + (small ? ' stamp-small' : '')} title={`Average rating: ${display}`}>
      <div className="stamp-inner">
        <span className="stamp-value">{display}</span>
      </div>
    </div>
  )
}

export function StarPicker({ value, onChange }) {
  return (
    <div className="star-picker" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          type="button"
          key={n}
          className={n <= value ? 'filled' : ''}
          onClick={() => onChange(n)}
          aria-pressed={n <= value}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}
