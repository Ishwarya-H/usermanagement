import { useEffect, useState } from "react";
import {
  getMyInvitations,
  acceptInvitation,
  rejectInvitation,
} from "../../api/invitationApi";
import Pagination from "../Pagination/Pagination";

function MyInvitations() {
  const [invitations, setInvitations] =
    useState([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [itemsPerPage, setItemsPerPage] =
    useState(5);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const response =
        await getMyInvitations();

      setInvitations(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAcceptInvitation = async (
    id
  ) => {
    try {
      await acceptInvitation(id);

      fetchInvitations();

      alert(
        "Invitation accepted successfully"
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to accept invitation"
      );
    }
  };

  const handleRejectInvitation = async (
    id
  ) => {
    try {
      await rejectInvitation(id);

      fetchInvitations();

      alert("Invitation rejected");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to reject invitation"
      );
    }
  };

  const statusOptions = [
    "All",
    ...new Set(
      invitations.map(
        (invitation) =>
          invitation.status
      )
    ),
  ];

  const filteredInvitations =
    invitations.filter(
      (invitation) => {
        const matchesSearch =
          invitation.groupName
            .toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            );

        const matchesFilter =
          statusFilter === "All" ||
          invitation.status ===
            statusFilter;

        return (
          matchesSearch &&
          matchesFilter
        );
      }
    );

  const lastIndex =
    currentPage * itemsPerPage;

  const firstIndex =
    lastIndex - itemsPerPage;

  const currentInvitations =
    filteredInvitations.slice(
      firstIndex,
      lastIndex
    );

  const totalPages = Math.ceil(
    filteredInvitations.length /
      itemsPerPage
  );

  return (
    <div className="admin-section">
      <h3>My Invitations</h3>

      {invitations.length === 0 ? (
        <p className="empty-state">
          No invitations found.
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
              placeholder="Search invitations..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(
                  e.target.value
                );
                setCurrentPage(1);
              }}
            />

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(
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
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentInvitations.map(
                (invitation) => (
                  <tr
                    key={invitation._id}
                  >
                    <td>
                      {
                        invitation.groupName
                      }
                    </td>

                    <td>
                      <span
                        className={`badge ${
                          invitation.status ===
                          "Pending"
                            ? "badge--pending"
                            : invitation.status ===
                              "Accepted"
                            ? "badge--approved"
                            : "badge--rejected"
                        }`}
                      >
                        {
                          invitation.status
                        }
                      </span>
                    </td>

                    <td>
                      {invitation.status ===
                        "Pending" && (
                        <>
                          <button
                            className="table-btn table-btn--approve"
                            onClick={() =>
                              handleAcceptInvitation(
                                invitation._id
                              )
                            }
                          >
                            Accept
                          </button>

                          <button
                            className="table-btn table-btn--reject"
                            onClick={() =>
                              handleRejectInvitation(
                                invitation._id
                              )
                            }
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>

          <div
            style={{
              borderTop:
                "1px solid #dcdcdc",
              marginTop: "10px",
              paddingTop: "10px",
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
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

export default MyInvitations;