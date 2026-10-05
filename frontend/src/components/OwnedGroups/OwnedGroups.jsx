import { useEffect, useState } from "react";
import { getOwnedGroups } from "../../api/groupApi";
import { useNavigate } from "react-router-dom";
import Pagination from "../Pagination/Pagination";

function OwnedGroups() {
  const [groups, setGroups] = useState([]);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [itemsPerPage, setItemsPerPage] =
    useState(5);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [filterStatus, setFilterStatus] =
    useState("All");

  const navigate = useNavigate();

  useEffect(() => {
    fetchOwnedGroups();
  }, []);

  const fetchOwnedGroups = async () => {
    try {
      const response =
        await getOwnedGroups();

      setGroups(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredGroups =
    groups.filter((group) => {
      const matchesSearch =
        group.groupName
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          );

      const matchesFilter =
        filterStatus === "All" ||
        (filterStatus === "Active" &&
          group.isActive) ||
        (filterStatus ===
          "Inactive" &&
          !group.isActive);

      return (
        matchesSearch &&
        matchesFilter
      );
    });

  const filterOptions = [
    "All",
    ...new Set(
      groups.map((group) =>
        group.isActive
          ? "Active"
          : "Inactive"
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
      <h3>Owned Groups</h3>

      {groups.length === 0 ? (
        <p className="empty-state">
          You don't own any groups.
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
              placeholder="Search groups..."
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
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(
                  e.target.value
                );
                setCurrentPage(1);
              }}
              className="filter-dropdown"
            >
              {filterOptions.map(
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
                <th>Members</th>
                <th>Status</th>
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
                        group.memberCount
                      }
                    </td>

                    <td>
                      {group.isActive ? (
                        <span className="badge badge--approved">
                          Active
                        </span>
                      ) : (
                        <span className="badge badge--rejected">
                          Inactive
                        </span>
                      )}
                    </td>

                    <td>
                      {group.isActive ? (
                        <button
                          className="table-btn table-btn--approve"
                          onClick={() =>
                            navigate(
                              `/manage-group/${group._id}`
                            )
                          }
                        >
                          Manage
                        </button>
                      ) : (
                        <button
                          className="table-btn table-btn--reject"
                          disabled
                        >
                          Group
                          Deactivated
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
              <label>
                Show{" "}
              </label>

              <select
                value={
                  itemsPerPage
                }
                onChange={(e) => {
                  setItemsPerPage(
                    Number(
                      e.target.value
                    )
                  );

                  setCurrentPage(
                    1
                  );
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

              <span>
                {" "}
                entries
              </span>
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

export default OwnedGroups;