import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Dashboard', index: '00' },
  { to: '/guests', label: 'Guests', index: '01' },
  { to: '/hotels', label: 'Hotels', index: '02' },
  { to: '/ratings', label: 'Ratings', index: '03' },
  // { to: '/settings', label: 'Settings', index: '04' },
]

function NavItems({ onNavigate }) {
  return (
    <ul className="nav-list">
      {links.map((link) => (
        <li key={link.to}>
          <NavLink
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
            onClick={onNavigate}
          >
            <span className="nav-index">{link.index}</span>
            {link.label}
          </NavLink>
        </li>
      ))}
    </ul>
  )
}

export default function Navbar() {
  return (
    <>
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">L</div>
          <div className="brand-name">The Ledger</div>
          <div className="brand-tag">Hotel Rating Registry</div>
        </div>
        <NavItems />
        {/* <div className="sidebar-footer">
          Connected to the gateway
          <br />
          set in Settings.
        </div> */}
      </aside>

      <div className="mobile-topbar">
        <div className="brand-name" style={{ fontSize: 18 }}>
          The Ledger
        </div>
      </div>
      {/* <nav className="mobile-nav">
        <NavItems />
      </nav> */}
    </>
  )
}
