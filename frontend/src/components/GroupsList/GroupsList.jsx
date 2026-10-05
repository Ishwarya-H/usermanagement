import { useEffect, useState } from "react";
import {
  getGroups,
  activateGroup,
  deactivateGroup,
} from "../../api/groupApi";
import Pagination from "../Pagination/Pagination";

function GroupsList() {
  const [groups, setGroups] = useState([]);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [itemsPerPage, setItemsPerPage] =
    useState(5);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await getGroups();
      setGroups(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleActivate = async (id) => {
    try {
      await activateGroup(id);

      alert(
        "Group activated successfully"
      );

      fetchGroups();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to activate group"
      );
    }
  };

  const handleDeactivate = async (
    id
  ) => {
    try {
      await deactivateGroup(id);

      alert(
        "Group deactivated successfully"
      );

      fetchGroups();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to deactivate group"
      );
    }
  };

  /* Search + Filter */

  const filteredGroups =
    groups.filter((group) => {
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

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" &&
          group.isActive) ||
        (statusFilter ===
          "Inactive" &&
          !group.isActive);

      return (
        matchesSearch &&
        matchesStatus
      );
    });
const statusOptions = [
  "All",
  ...new Set(
    groups.map((group) =>
      group.isActive
        ? "Active"
        : "Inactive"
    )
  ),
];
  /* Pagination */

  const lastIndex =
    currentPage * itemsPerPage;

  const firstIndex =
    lastIndex - itemsPerPage;

  const currentGroups =
    filteredGroups.slice(
      firstIndex,
      lastIndex
    );

  const totalPages = Math.ceil(
    filteredGroups.length /
      itemsPerPage
  );

  return (
    <div className="admin-section">
      <h3>All Groups</h3>

      {groups.length === 0 ? (
        <p className="empty-state">
          No groups created yet.
        </p>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "15px",
              flexWrap: "wrap",
            }}
          >
            <input
              type="text"
              placeholder="Search groups or admins..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(
                  e.target.value
                );
                setCurrentPage(1);
              }}
              className="search-box"
            />

            <select
  value={statusFilter}
  onChange={(e) => {
    setStatusFilter(
      e.target.value
    );
    setCurrentPage(1);
  }}
  className="filter-dropdown"
>
  {statusOptions.map(
    (status) => (
      <option
        key={status}
        value={status}
      >
        {status === "All"
          ? "All Status"
          : status}
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
                <th>Status</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentGroups.map(
                (group) => (
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
                      <span
                        className={`badge ${
                          group.isActive
                            ? "badge--approved"
                            : "badge--rejected"
                        }`}
                      >
                        {group.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    <td>
                      {new Date(
                        group.createdAt
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      {group.isActive ? (
                        <button
                          className="table-btn table-btn--reject"
                          onClick={() =>
                            handleDeactivate(
                              group._id
                            )
                          }
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          className="table-btn table-btn--approve"
                          onClick={() =>
                            handleActivate(
                              group._id
                            )
                          }
                        >
                          Activate
                        </button>
                      )}
                    </td>
                  </tr>
                )
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
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(
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

export default GroupsList;