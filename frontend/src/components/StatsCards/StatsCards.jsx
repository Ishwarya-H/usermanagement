import { useEffect, useState } from "react";
import { getStats } from "../../api/dashboardApi";

function StatsCards() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingRequests: 0,
    totalGroups: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await getStats();

      setStats(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="stats-cards">
      <div className="stat-card stat-card--info">
        <div className="stat-value">
          {stats.totalUsers}
        </div>

        <div className="stat-label">
          Total Users
        </div>
      </div>

      <div className="stat-card stat-card--warning">
        <div className="stat-value">
          {stats.pendingRequests}
        </div>

        <div className="stat-label">
          Pending Requests
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-value">
          {stats.totalGroups}
        </div>

        <div className="stat-label">
          Total Groups
        </div>
      </div>
    </div>
  );
}

export default StatsCards;