import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {
  const {
    user,
    isAuthenticated,
    loading,
  } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (isAuthenticated && user) {
    if (user.role === "admin") {
      return (
        <Navigate
          to="/admin-dashboard"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return children;
}

export default PublicRoute;
