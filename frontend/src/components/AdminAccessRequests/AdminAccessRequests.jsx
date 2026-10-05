import { useEffect, useState } from "react";
import {
  getAdminRequests,
  approveAdminRequest,
  rejectAdminRequest,
} from "../../api/groupApi";

function AdminAccessRequests({ groupId }) {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, [groupId]);

  const fetchRequests = async () => {
    try {
      const response =
        await getAdminRequests(groupId);

      setRequests(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const approveRequest = async (id) => {
    try {
      await approveAdminRequest(id);

      alert(
        "Admin access request approved"
      );

      fetchRequests();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to approve request"
      );
    }
  };

  const rejectRequest = async (id) => {
    try {
      await rejectAdminRequest(id);

      alert(
        "Admin access request rejected"
      );

      fetchRequests();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to reject request"
      );
    }
  };

  return (
    <div className="admin-section">
      <h3>Admin Access Requests</h3>

      {requests.length === 0 ? (
        <p className="empty-state">
          No admin access requests.
        </p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((request) => (
              <tr key={request._id}>
                <td>
                  {
                    request.userId
                      ?.firstName
                  }{" "}
                  {
                    request.userId
                      ?.lastName
                  }
                </td>

                <td>
                  {
                    request.userId
                      ?.email
                  }
                </td>

                <td>
                  <button
                    className="table-btn table-btn--approve"
                    onClick={() =>
                      approveRequest(
                        request._id
                      )
                    }
                  >
                    Approve
                  </button>

                  <button
                    className="table-btn table-btn--reject"
                    onClick={() =>
                      rejectRequest(
                        request._id
                      )
                    }
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminAccessRequests;