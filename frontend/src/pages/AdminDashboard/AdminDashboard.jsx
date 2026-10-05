import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import StatsCards from '../../components/StatsCards/StatsCards';
import UsersList from '../../components/UsersList/UsersList';
import GroupsList from '../../components/GroupsList/GroupsList';
import './AdminDashboard.scss';
import GroupCreationRequests from "../../components/GroupCreationRequests/GroupCreationRequests";
import AuditLogs from "../../components/AuditLogs/AuditLogs";
function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('requests');

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <button className={`admin-tab ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => setActiveTab('requests')}>
          Requests
        </button>
        <button className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
          Users
        </button>
        <button className={`admin-tab ${activeTab === 'groups' ? 'active' : ''}`} onClick={() => setActiveTab('groups')}>
          Groups
        </button>
        <button className={`admin-tab ${activeTab === "auditLogs"? "active": ""}`}
  onClick={() =>setActiveTab("auditLogs")}>Audit Logs</button>
      </aside>

      <div className="admin-content">
        <div className="admin-header">
          <h2>Admin Dashboard</h2>
          <p>Welcome back, {user.firstName}</p>
        </div>

        <StatsCards />

        {activeTab === 'users' && <UsersList />}
        {activeTab === 'groups' && <GroupsList />}
        {activeTab === "requests" && (<GroupCreationRequests />)}
        {activeTab === "auditLogs" && (<AuditLogs />)}
    
      </div>
    </div>
  );
}

export default AdminDashboard;