import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import CreateGroup from "../../components/CreateGroup/CreateGroup";
import OwnedGroups from "../../components/OwnedGroups/OwnedGroups";
import MyInvitations from "../../components/MyInvitations/MyInvitations";
import MyGroups from "../../components/MyGroups/MyGroups";
import "../AdminDashboard/AdminDashboard.scss";
import AvailableGroups from "../../components/AvailableGroups/AvailableGroups";
function UserDashboard() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] =
    useState("ownedGroups");

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">

        <button
          className={`admin-tab ${
            activeTab === "ownedGroups"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setActiveTab("ownedGroups")
          }
        >
          Owned Groups
        </button>

        <button
          className={`admin-tab ${
            activeTab === "myGroups"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setActiveTab("myGroups")
          }
        >
          My Groups
        </button>

        <button
          className={`admin-tab ${
            activeTab === "invitations"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setActiveTab("invitations")
          }
        >
          My Invitations
        </button>

        <button
          className={`admin-tab ${
            activeTab === "createGroup"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setActiveTab("createGroup")
          }
        >
          Create Group
        </button>
        <button
  className={`admin-tab ${
    activeTab === "availableGroups"
      ? "active"
      : ""
  }`}
  onClick={() =>
    setActiveTab("availableGroups")
  }
>
  Available Groups
</button>

      </aside>

      <div className="admin-content">

        <div className="admin-header">
          <h2>User Dashboard</h2>
          <p>
            Welcome, {user.firstName}
          </p>
        </div>

        {activeTab === "ownedGroups" && (
          <OwnedGroups />
        )}

        {activeTab === "myGroups" && (
          <MyGroups />
        )}

        {activeTab === "invitations" && (
          <MyInvitations />
        )}

        {activeTab === "createGroup" && (
          <CreateGroup />
        )}
        {activeTab === "availableGroups" && (
  <AvailableGroups />
)}

      </div>
    </div>
  );
}

export default UserDashboard;