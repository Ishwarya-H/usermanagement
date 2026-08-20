import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <h2>User Management System</h2>
      <nav>
        <Link to="/">Login</Link> | <Link to="/register">Register</Link> | <Link to="/dashboard">Dashboard</Link>
      </nav>
    </header>
  );
}

export default Header;