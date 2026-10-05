import { useAuth } from "../../context/AuthContext";
import GroupJoinRequests from "../../components/GroupJoinRequests/GroupJoinRequests";
import GroupMembers from "../../components/GroupMembers/GroupMembers";
import GroupInfo from "../../components/GroupInfo/GroupInfo";
import "../AdminDashboard/AdminDashboard.scss";

function GroupAdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="admin-layout">
      <div
        className="admin-content"
        style={{ width: "100%" }}
      >
        <div className="admin-header">
          <h2>Group Admin Dashboard</h2>

          <p>
            Welcome, {user.firstName}!
          </p>
        </div>

        <GroupInfo />

        <div style={{ marginTop: "20px" }}>
          <GroupJoinRequests />
        </div>

        <div style={{ marginTop: "20px" }}>
          <GroupMembers />
        </div>
      </div>
    </div>
  );
}

export default GroupAdminDashboard;