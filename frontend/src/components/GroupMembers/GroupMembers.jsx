import { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../Pagination/Pagination";

function GroupMembers({ groupId }) {
  const [members, setMembers] = useState([]);
  const [group, setGroup] = useState(null);

  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 5;

  useEffect(() => {
    fetchGroup();
    fetchMembers();
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
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/memberships/members/${groupId}`,
        {
          withCredentials: true,
        }
      );

      setMembers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const removeMember = async (id) => {
    if (
      !window.confirm(
        "Remove this member from the group?"
      )
    ) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/memberships/${id}`,
        {
          withCredentials: true,
        }
      );

      fetchMembers();

      alert("Member removed successfully");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to remove member"
      );
    }
  };

  const approveAdminRequest = async (
    requestId
  ) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/group-admin-request/${requestId}/approve`,
        {},
        {
          withCredentials: true,
        }
      );

      alert(
        "Admin access approved successfully"
      );

      fetchMembers();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to approve request"
      );
    }
  };

  const rejectAdminRequest = async (
    requestId
  ) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/group-admin-request/${requestId}/reject`,
        {},
        {
          withCredentials: true,
        }
      );

      alert("Admin access rejected");

      fetchMembers();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to reject request"
      );
    }
  };

  const renderStatus = (member) => {
    if (member.isGroupAdmin) {
      return (
        <span className="badge badge--approved">
          Group Admin
        </span>
      );
    }

    if (
      member.adminRequestStatus ===
      "Pending"
    ) {
      return (
        <span className="badge badge--warning">
          Admin Request Pending
        </span>
      );
    }

    return (
      <span className="badge badge--approved">
        Active
      </span>
    );
  };

  /* Pagination Logic */

  const lastIndex =
    currentPage * itemsPerPage;

  const firstIndex =
    lastIndex - itemsPerPage;

  const currentMembers =
    members.slice(
      firstIndex,
      lastIndex
    );

  const totalPages = Math.ceil(
    members.length / itemsPerPage
  );

  return (
    <div className="admin-section">
      <h3>Group Members</h3>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {group && (
            <tr>
              <td>
                {group.groupAdminId?.firstName}{" "}
                {
                  group.groupAdminId
                    ?.lastName
                }
              </td>

              <td>
                {
                  group.groupAdminId
                    ?.email
                }
              </td>

              <td>
                <span className="badge badge--approved">
                  Owner
                </span>
              </td>

              <td>-</td>
            </tr>
          )}

          {currentMembers.map(
            (member) => (
              <tr key={member.id}>
                <td>
                  {member.name}
                </td>

                <td>
                  {member.email}
                </td>

                <td>
                  {renderStatus(
                    member
                  )}
                </td>

                <td>
                  {member.adminRequestStatus ===
                  "Pending" ? (
                    <>
                      <button
                        className="table-btn table-btn--approve"
                        onClick={() =>
                          approveAdminRequest(
                            member.adminRequestId
                          )
                        }
                      >
                        Approve Admin
                      </button>

                      <button
                        className="table-btn table-btn--reject"
                        onClick={() =>
                          rejectAdminRequest(
                            member.adminRequestId
                          )
                        }
                      >
                        Reject Admin
                      </button>
                    </>
                  ) : !member.isGroupAdmin ? (
                    <button
                      className="table-btn table-btn--reject"
                      onClick={() =>
                        removeMember(
                          member.id
                        )
                      }
                    >
                      Remove
                    </button>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>

      {members.length >
        itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={
            setCurrentPage
          }
        />
      )}
    </div>
  );
}

export default GroupMembers;