import { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../Pagination/Pagination";

function AvailableGroups() {
  const [groups, setGroups] = useState([]);
  const [myRequests, setMyRequests] =
    useState([]);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [groupsPerPage, setGroupsPerPage] =
    useState(5);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [filterStatus, setFilterStatus] =
    useState("All");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const groupsRes = await axios.get(
        "http://localhost:5000/api/groups/available",
        {
          withCredentials: true,
        }
      );

      setGroups(groupsRes.data);

      try {
        const requestsRes = await axios.get(
          "http://localhost:5000/api/memberships/my-requests",
          {
            withCredentials: true,
          }
        );

        setMyRequests(requestsRes.data);
      } catch (err) {
        console.log(
          "Failed to load requests",
          err
        );

        setMyRequests([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getRequestStatusForGroup = (
    groupName
  ) => {
    const existing = myRequests.find(
      (r) => r.groupName === groupName
    );

    return existing
      ? existing.status
      : null;
  };

  const requestJoin = async (
    groupId
  ) => {
    if (
      !window.confirm(
        "Send a request to join this group?"
      )
    ) {
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/memberships/request",
        { groupId },
        {
          withCredentials: true,
        }
      );

      alert(
        "Join request sent successfully"
      );

      fetchData();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to send join request"
      );
    }
  };

  /* Search + Filter */

  const filteredGroups = groups.filter(
    (group) => {
      const status =
        getRequestStatusForGroup(
          group.groupName
        );

      const matchesSearch =
        group.groupName
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||
        group.groupAdminName
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          );

      const matchesFilter =
        filterStatus === "All" ||
        (filterStatus ===
          "Available" &&
          !status) ||
        (filterStatus ===
          "Requested" &&
          status === "Pending") ||
        (filterStatus === "Member" &&
          status === "Approved") ||
        (filterStatus ===
          "Rejected" &&
          status === "Rejected");

      return (
        matchesSearch &&
        matchesFilter
      );
    }
  );
const statusOptions = [
  "All",
  ...new Set(
    groups
      .map((group) => {
        const status =
          getRequestStatusForGroup(
            group.groupName
          );

        if (!status) {
          return "Available";
        }

        if (status === "Pending") {
          return "Requested";
        }

        if (status === "Approved") {
          return "Member";
        }

        if (status === "Rejected") {
          return "Rejected";
        }

        return null;
      })
      .filter(Boolean)
  ),
];
  /* Pagination */

  const lastIndex =
    currentPage * groupsPerPage;

  const firstIndex =
    lastIndex - groupsPerPage;

  const currentGroups =
    filteredGroups.slice(
      firstIndex,
      lastIndex
    );

  const totalPages = Math.ceil(
    filteredGroups.length /
      groupsPerPage
  );

  return (
    <div className="admin-section">
      <h3>Available Groups</h3>

      {groups.length === 0 ? (
        <p className="empty-state">
          No groups available right now.
        </p>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "15px",
            }}
          >
            <input
              type="text"
              placeholder="Search groups..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(
                  e.target.value
                );
                setCurrentPage(1);
              }}
            />
            <select
  value={filterStatus}
  onChange={(e) => {
    setFilterStatus(
      e.target.value
    );
    setCurrentPage(1);
  }}
>
  {statusOptions.map(
    (status) => (
      <option
        key={status}
        value={status}
      >
        {status}
      </option>
    )
  )}
</select>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Group Name</th>
                <th>Group Admin</th>
                <th>Members</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentGroups.map(
                (group) => {
                  const status =
                    getRequestStatusForGroup(
                      group.groupName
                    );

                  return (
                    <tr key={group._id}>
                      <td>
                        {group.groupName}
                      </td>

                      <td>
                        {
                          group.groupAdminName
                        }
                      </td>

                      <td>
                        {
                          group.memberCount
                        }
                      </td>

                      <td>
                        {status ===
                          "Pending" && (
                          <span className="badge badge--pending">
                            Requested
                          </span>
                        )}

                        {status ===
                          "Approved" && (
                          <span className="badge badge--approved">
                            Member
                          </span>
                        )}

                        {status ===
                          "Rejected" && (
                          <span className="badge badge--rejected">
                            Rejected
                          </span>
                        )}

                        {!status && (
                          <button
                            className="table-btn table-btn--approve"
                            onClick={() =>
                              requestJoin(
                                group._id
                              )
                            }
                          >
                            Request Join
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              borderTop:
                "1px solid #dcdcdc",
              paddingTop: "10px",
              marginTop: "10px",
            }}
          >
            <div>
              <label>Show </label>

              <select
                value={groupsPerPage}
                onChange={(e) => {
                  setGroupsPerPage(
                    Number(
                      e.target.value
                    )
                  );

                  setCurrentPage(1);
                }}
              >
                <option value={5}>
                  5
                </option>
                <option value={10}>
                  10
                </option>
                <option value={15}>
                  15
                </option>
                <option value={20}>
                  20
                </option>
              </select>

              <span> entries</span>
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={
                  currentPage
                }
                totalPages={
                  totalPages
                }
                setCurrentPage={
                  setCurrentPage
                }
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default AvailableGroups;