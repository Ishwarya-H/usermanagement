import { useEffect, useState } from "react";
import {
  getUsers,
  activateUser,
  deactivateUser,
} from "../../api/userApi";
import Pagination from "../Pagination/Pagination";

function UsersList() {
  const [users, setUsers] = useState([]);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [itemsPerPage, setItemsPerPage] =
    useState(5);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [roleFilter, setRoleFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const fetchUsers = async () => {
    try {
      const response = await getUsers();

      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeactivateUser =
    async (id) => {
      if (
        !window.confirm(
          "Are you sure you want to DEACTIVATE this user?"
        )
      )
        return;

      try {
        await deactivateUser(id);

        fetchUsers();
      } catch (error) {
        alert(
          error.response?.data
            ?.message ||
            "Failed to deactivate user"
        );
      }
    };

  const handleActivateUser =
    async (id) => {
      if (
        !window.confirm(
          "Are you sure you want to ACTIVATE this user?"
        )
      )
        return;

      try {
        await activateUser(id);

        fetchUsers();
      } catch (error) {
        alert(
          error.response?.data
            ?.message ||
            "Failed to activate user"
        );
      }
    };

  /* Search + Filter */

  const filteredUsers = users.filter(
    (user) => {
      const fullName = `${user.firstName} ${user.lastName}`;

      const matchesSearch =
        fullName
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||
        user.email
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          );

      const matchesRole =
        roleFilter === "All" ||
        user.role === roleFilter;

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" &&
          user.isActive) ||
        (statusFilter ===
          "Inactive" &&
          !user.isActive);

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    }
  );
const roleOptions = [
  "All",
  ...new Set(
    users.map((user) => user.role)
  ),
];

const statusOptions = [
  "All",
  ...new Set(
    users.map((user) =>
      user.isActive
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

  const currentUsers =
    filteredUsers.slice(
      firstIndex,
      lastIndex
    );

  const totalPages = Math.ceil(
    filteredUsers.length /
      itemsPerPage
  );

  return (
    <div className="admin-section">
      <h3>All Users</h3>

      {users.length === 0 ? (
        <p className="empty-state">
          No users found.
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
              placeholder="Search user..."
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
  value={roleFilter}
  onChange={(e) => {
    setRoleFilter(
      e.target.value
    );
    setCurrentPage(1);
  }}
  className="filter-dropdown"
>
  {roleOptions.map((role) => (
    <option
      key={role}
      value={role}
    >
      {role === "All"
        ? "All Roles"
        : role}
    </option>
  ))}
</select>

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
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentUsers.map(
                (user) => (
                  <tr key={user._id}>
                    <td>
                      {
                        user.firstName
                      }{" "}
                      {user.lastName}
                    </td>

                    <td>
                      {user.email}
                    </td>

                    <td>
                      <span
                        className={`badge badge--${user.role}`}
                      >
                        {
                          user.role
                        }
                      </span>
                    </td>

                    <td>
                      <span
                        className={`badge ${
                          user.isActive
                            ? "badge--approved"
                            : "badge--rejected"
                        }`}
                      >
                        {user.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    <td>
                      {user.role !==
                        "admin" &&
                        (user.isActive ? (
                          <button
                            className="table-btn table-btn--reject"
                            onClick={() =>
                              handleDeactivateUser(
                                user._id
                              )
                            }
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            className="table-btn table-btn--approve"
                            onClick={() =>
                              handleActivateUser(
                                user._id
                              )
                            }
                          >
                            Activate
                          </button>
                        ))}
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

export default UsersList;