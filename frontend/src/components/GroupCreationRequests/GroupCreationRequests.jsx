import { useEffect, useState } from "react";
import axios from "axios";

function GroupCreationRequests() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/group-creation-requests",
        {
          withCredentials: true,
        }
      );

      setRequests(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const approveRequest = async (id) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/group-creation-requests/${id}/approve`,
        {},
        {
          withCredentials: true,
        }
      );

      fetchRequests();

      alert("Request approved");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to approve request"
      );
    }
  };

  const rejectRequest = async (id) => {
    const reason = prompt(
      "Enter rejection reason"
    );

    if (!reason) return;

    try {
      await axios.patch(
        `http://localhost:5000/api/group-creation-requests/${id}/reject`,
        {
          rejectionReason: reason,
        },
        {
          withCredentials: true,
        }
      );

      fetchRequests();

      alert("Request rejected");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to reject request"
      );
    }
  };

  return (
    <div className="admin-section">
      <h3>Group Creation Requests</h3>

      {requests.length === 0 ? (
        <p className="empty-state">
          No pending requests.
        </p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Group Name</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((request) => (
              <tr key={request._id}>
                <td>{request.userName}</td>

                <td>{request.email}</td>

                <td>{request.groupName}</td>

                <td>{request.status}</td>

                <td>
                  <button
                    className="table-btn table-btn--approve"
                    onClick={() =>
                      approveRequest(request._id)
                    }
                  >
                    Approve
                  </button>

                  <button
                    className="table-btn table-btn--reject"
                    onClick={() =>
                      rejectRequest(request._id)
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

export default GroupCreationRequests;