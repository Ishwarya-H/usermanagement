import { useEffect, useState } from "react";
import axios from "axios";

function InviteUsers({ groupId }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, [groupId]);

  const fetchUsers = async () => {
    try {
      const [usersRes, membersRes, groupRes] =
        await Promise.all([
          axios.get(
            "http://localhost:5000/api/users/invite-list",
            {
              withCredentials: true,
            }
          ),
          axios.get(
            `http://localhost:5000/api/memberships/members/${groupId}`,
            {
              withCredentials: true,
            }
          ),
          axios.get(
            `http://localhost:5000/api/groups/${groupId}`,
            {
              withCredentials: true,
            }
          ),
        ]);

      const memberEmails = membersRes.data.map(
        (m) => m.email
      );

      const ownerName =
        groupRes.data.groupAdminName;

      const filteredUsers =
        usersRes.data.filter((user) => {
          const fullName =
            `${user.firstName} ${user.lastName}`;

          const alreadyMember =
            memberEmails.includes(user.email);

          const isOwner =
            fullName === ownerName;

          return !alreadyMember && !isOwner;
        });

      setUsers(filteredUsers);
    } catch (error) {
      console.log(error);
    }
  };

  const sendInvitation = async (userId) => {
    try {
      await axios.post(
        "http://localhost:5000/api/invitations/send",
        {
          userId,
          groupId,
        },
        {
          withCredentials: true,
        }
      );

      alert(
        "Invitation sent successfully"
      );

      fetchUsers();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to send invitation"
      );
    }
  };

  return (
    <div className="admin-section">
      <h3>Invite Users</h3>

      {users.length === 0 ? (
        <p className="empty-state">
          No users available.
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
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  {user.firstName}{" "}
                  {user.lastName}
                </td>

                <td>{user.email}</td>

                <td>
                  <button
                    className="table-btn table-btn--approve"
                    onClick={() =>
                      sendInvitation(user._id)
                    }
                  >
                    Invite
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

export default InviteUsers;