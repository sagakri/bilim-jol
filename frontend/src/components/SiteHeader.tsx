import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthContext'

export function SiteHeader() {
  const { user, logout } = useAuth()

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" to="/opportunities" aria-label="BilimJol — каталог возможностей">
          <img src={`${import.meta.env.BASE_URL}bilimjol-logo.png`} alt="" />
          <span>BilimJol</span>
        </Link>
        <nav className="main-nav" aria-label="Главная навигация">
          <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/opportunities">Возможности</NavLink>
          <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/dashboard/deadlines">Дедлайны</NavLink>
          <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/favorites">Избранное</NavLink>
          <Link className="nav-link" to="/opportunities#about">О проекте</Link>
        </nav>
        <div className="header-actions">
          {user
            ? <><Link className="header-account" to="/profile"><span className="header-avatar" aria-hidden="true">{user.displayName.slice(0, 1).toUpperCase()}</span><span>{user.displayName}</span></Link><button className="header-logout" onClick={logout} type="button">Выйти</button></>
            : <Link className="header-login" to="/login">Войти</Link>}
          <Link className="header-action" to="/opportunities#catalog">Найти программу <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
    </header>
  )
}
