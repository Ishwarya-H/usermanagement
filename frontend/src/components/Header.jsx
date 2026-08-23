import { NavLink } from 'react-router-dom';
import './Header.scss';

function Header() {
  return (
    <header className="header">
      <h1 className="header__title">User Management System</h1>
      <nav className="header__nav">
        <NavLink to="/" className="header__link">Register</NavLink>
        <NavLink to="/login" className="header__link">Login</NavLink>
        <NavLink to="/dashboard" className="header__link">Dashboard</NavLink>
      </nav>
    </header>
  );
}

export default Header;