import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <p>You are not logged in.</p>;
  }

  return (
    <div>
      <h2>Dashboard Page</h2>
      <p>Welcome, {user.email}!</p>
      <p>Your role: {user.role}</p>
    </div>
  );
}

export default Dashboard;