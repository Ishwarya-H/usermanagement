import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import InviteUsers from "../../components/InviteUsers/InviteUsers";
import GroupMembers from "../../components/GroupMembers/GroupMembers";
import PendingJoinRequests from "../../components/PendingJoinRequests/PendingJoinRequests";

import "../AdminDashboard/AdminDashboard.scss";

function ManageGroup() {
  const { groupId } = useParams();

  const [group, setGroup] = useState(null);
  const [memberLimit, setMemberLimit] =
    useState("");

  useEffect(() => {
    fetchGroup();
  }, [groupId]);

  const fetchGroup = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/groups/${groupId}`,
        {
          withCredentials: true,
        }
      );

      setGroup(response.data);
      setMemberLimit(
        response.data.memberLimit || 0
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateLimit = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/groups/${groupId}/member-limit`,
        {
          memberLimit,
        },
        {
          withCredentials: true,
        }
      );

      alert(
        "Member limit updated successfully"
      );

      fetchGroup();
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to update member limit"
      );
    }
  };

  if (!group) {
    return (
      <div className="admin-content">
        <p>
          Loading group information...
        </p>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <div
        className="admin-content"
        style={{ width: "100%" }}
      >
        <div className="admin-header">
          <h2>Manage Group</h2>

          <p>
            Manage your group members,
            requests and invitations
          </p>
        </div>
        
        
<div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">
              {group.groupName}
            </div>

            <div className="stat-label">
              Group Name
            </div>
          </div>

          <div className="stat-card stat-card--info">
            <div className="stat-value">
              {group.memberCount}/
              {group.memberLimit || "∞"}
            </div>

            <div className="stat-label">
              Members
            </div>
          </div>

          <div className="stat-card stat-card--warning">
            <div className="stat-value">
              {new Date(
                group.createdAt
              ).toLocaleDateString()}
            </div>

            <div className="stat-label">
              Created Date
            </div>
          </div>

          <div className="group-settings-card">
            <h4
              style={{
                marginBottom: "15px",
                color: "#0b2253",
              }}
            >
              Group Settings
            </h4>

            <div className="setting-group">
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "600",
                }}
              >
                Allow Join Requests
              </label>

              <select
                value={
                  group.allowJoinRequests
                    ? "true"
                    : "false"
                }
                onChange={async (e) => {
                  try {
                    await axios.put(
                      `http://localhost:5000/api/groups/${groupId}/join-setting`,
                      {
                        allowJoinRequests:
                          e.target.value ===
                          "true",
                      },
                      {
                        withCredentials: true,
                      }
                    );

                    fetchGroup();
                  } catch (err) {
                    console.log(err);
                  }
                }}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "6px",
                  border:
                    "1px solid #dcdcdc",
                }}
              >
                <option value="true">
                  ON
                </option>

                <option value="false">
                  OFF
                </option>
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "600",
                }}
              >
                Member Limit
              </label>

              <div className="limit-controls">
                <input
                  type="number"
                  min="0"
                  value={memberLimit}
                  onChange={(e) =>
                    setMemberLimit(
                      e.target.value
                    )
                  }
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "6px",
                    border:
                      "1px solid #dcdcdc",
                  }}
                />

                <button
                  className="btn btn-primary"
                  onClick={
                    handleUpdateLimit
                  }
                >
                  Save
                </button>
              </div>

              <small className="current-limit">
                Current Limit:{" "}
                {group.memberLimit || "∞"}
              </small>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "20px" }}>
          <PendingJoinRequests
            groupId={groupId}
          />
        </div>

        <div style={{ marginTop: "20px" }}>
          <GroupMembers
            groupId={groupId}
          />
        </div>

        <div style={{ marginTop: "20px" }}>
          <InviteUsers
            groupId={groupId}
          />
        </div>
      </div>
    </div>
  );
}

export default ManageGroup;