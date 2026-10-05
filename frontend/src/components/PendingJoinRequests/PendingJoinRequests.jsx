import { useEffect, useState } from "react";
import {
  getPendingRequests,
  approveJoinRequest,
  rejectJoinRequest,
} from "../../api/groupApi";

function PendingJoinRequests({
  groupId,
}) {
  const [requests, setRequests] =
    useState([]);

  useEffect(() => {
    fetchRequests();
  }, [groupId]);

  const fetchRequests = async () => {
    try {
      const response =
        await getPendingRequests(
          groupId
        );

      setRequests(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const approveRequest = async (
    id
  ) => {
    try {
      await approveJoinRequest(id);
     
      fetchRequests();
      window.location.reload();

      alert(
        "Request approved successfully"
      );
    } catch (error) {
      console.log(error);
    }
  };

  const rejectRequest = async (
    id
  ) => {
    try {
      await rejectJoinRequest(id);

      fetchRequests();
      window.location.reload();
      alert("Request rejected");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="admin-section">
      <h3>
        Pending Join Requests
      </h3>

      {requests.length === 0 ? (
        <p className="empty-state">
          No pending requests.
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
              <tr
                key={request._id}
              >
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

export default PendingJoinRequests;