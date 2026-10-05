import { useEffect, useState } from "react";
import axios from "axios";

function MyRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/memberships/my-requests", {
          withCredentials: true,
        });
        setRequests(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRequests();
  }, []);

  return (
    <div className="admin-section">
      <h3>My Requests</h3>
      {requests.length === 0 ? (
        <p className="empty-state">You haven't requested to join any group yet.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Group Name</th>
              <th>Status</th>
              <th>Rejection Reason</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id}>
                <td>{r.groupName}</td>
                <td>
                  <span
                    className={`badge ${
                      r.status === "Pending"
                        ? "badge--pending"
                        : r.status === "Approved"
                        ? "badge--approved"
                        : "badge--rejected"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td>{r.status === "Rejected" ? r.rejectionReason : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MyRequests;