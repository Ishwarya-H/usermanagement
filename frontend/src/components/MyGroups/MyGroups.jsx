import { useEffect, useState } from "react";
import {
  getMyGroups,
  requestGroupAdmin,
} from "../../api/groupApi";
import Pagination from "../Pagination/Pagination";

function MyGroups() {
  const [groups, setGroups] = useState([]);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [itemsPerPage, setItemsPerPage] =
    useState(5);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [filterType, setFilterType] =
    useState("All");

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response =
        await getMyGroups();

      setGroups(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const requestAdminAccess = async (
    groupId
  ) => {
    try {
      await requestGroupAdmin(groupId);

      alert(
        "Admin access request submitted successfully"
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to submit request"
      );
    }
  };

  const filteredGroups = groups.filter(
    (group) => {
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
        filterType === "All" ||
        (filterType === "Admin" &&
          group.isGroupAdmin) ||
        (filterType === "Member" &&
          !group.isGroupAdmin);

      return (
        matchesSearch &&
        matchesFilter
      );
    }
  );

  const filterOptions = [
    "All",
    ...new Set(
      groups.map((group) =>
        group.isGroupAdmin
          ? "Admin"
          : "Member"
      )
    ),
  ];

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
      <h3>My Groups</h3>

      {groups.length === 0 ? (
        <p className="empty-state">
          You are not a member of any
          group.
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
              className="search-box"
              placeholder="Search Group / Admin..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(
                  e.target.value
                );
                setCurrentPage(1);
              }}
            />

            <select
              className="filter-select"
              value={filterType}
              onChange={(e) => {
                setFilterType(
                  e.target.value
                );
                setCurrentPage(1);
              }}
            >
              {filterOptions.map(
                (option) => (
                  <option
                    key={option}
                    value={option}
                  >
                    {option === "All"
                      ? "All Groups"
                      : option ===
                        "Admin"
                      ? "I am Admin"
                      : "I am Member"}
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
                      {group.isGroupAdmin ? (
                        <div
                          style={{
                            display:
                              "flex",
                            gap: "8px",
                            alignItems:
                              "center",
                          }}
                        >
                          <span className="badge badge--approved">
                            Group Admin
                          </span>

                          <button
                            className="table-btn table-btn--approve"
                            onClick={() =>
                              (window.location.href =
                                `/manage-group/${group._id}`)
                            }
                          >
                            Manage
                          </button>
                        </div>
                      ) : (
                        <button
                          className="table-btn table-btn--approve"
                          onClick={() =>
                            requestAdminAccess(
                              group._id
                            )
                          }
                        >
                          Request Admin
                          Access
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

export default MyGroups;