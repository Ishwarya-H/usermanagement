import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.scss';
import NotificationBell
from "../NotificationBell/NotificationBell";
function Header() {
  const { isAuthenticated, logout, user } = useAuth();

  const dashboardPath =
  user?.role === 'admin'
    ? '/admin-dashboard'
    : '/dashboard';
  return (
    <header className="header">
      <h1 className="header__title">User Management System</h1>
      <nav className="header__nav">
        {isAuthenticated ? (
          <>
            <NavLink to={dashboardPath} className="header__link">Dashboard</NavLink>
            <NotificationBell />
            <NavLink to="/profile"className="header__link">Profile</NavLink>
            <button
              onClick={logout}
              className="header__link"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="header__link">Login</NavLink>
            <NavLink to="/register" className="header__link">Register</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;