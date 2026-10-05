import { useEffect, useState } from "react";
import axios from "axios";

function GroupJoinRequests() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/memberships/pending", {
        withCredentials: true,
      });
      setRequests(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const approveRequest = async (id) => {
    if (!window.confirm("Approve this join request?")) return;
    try {
      await axios.patch(`http://localhost:5000/api/memberships/${id}/approve`, {}, { withCredentials: true });
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to approve request");
    }
  };

  const rejectRequest = async (id) => {
    const reason = window.prompt("Enter a reason for rejecting this request:");
    if (reason === null) return; // cancelled
    if (!reason.trim()) {
      alert("Rejection reason cannot be empty.");
      return;
    }
    try {
      await axios.patch(
        `http://localhost:5000/api/memberships/${id}/reject`,
        { rejectionReason: reason.trim() },
        { withCredentials: true }
      );
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to reject request");
    }
  };

  return (
    <div className="admin-section">
      <h3>Join Requests</h3>
      {requests.length === 0 ? (
        <p className="empty-state">No pending join requests right now.</p>
      ) : (
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
            {requests.map((request) => (
              <tr key={request.id}>
                <td>{request.userName}</td>
                <td>{request.email}</td>
                <td><span className="badge badge--pending">Pending</span></td>
                <td>
                  <button className="table-btn table-btn--approve" onClick={() => approveRequest(request.id)}>
                    Approve
                  </button>
                  <button className="table-btn table-btn--reject" onClick={() => rejectRequest(request.id)}>
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

export default GroupJoinRequests;