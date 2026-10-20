import { Link, NavLink } from 'react-router-dom'

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" to="/opportunities" aria-label="BilimJol — каталог возможностей">
          <img src="/bilimjol-logo.png" alt="" />
          <span>BilimJol</span>
        </Link>
        <nav className="main-nav" aria-label="Главная навигация">
          <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/opportunities">Возможности</NavLink>
          <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/dashboard/deadlines">Дедлайны</NavLink>
          <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/favorites">Избранное</NavLink>
          <Link className="nav-link" to="/opportunities#about">О проекте</Link>
        </nav>
        <Link className="header-action" to="/opportunities#catalog">Найти программу <span aria-hidden="true">↗</span></Link>
      </div>
    </header>
  )
}
