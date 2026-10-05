import { useEffect, useState } from "react";
import axios from "axios";

function GroupInfo({ groupId }) {
  const [group, setGroup] = useState(null);

  useEffect(() => {
    fetchGroup();
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

  if (!group) {
    return (
      <div className="admin-section">
        <p>No group found.</p>
      </div>
    );
  }

  return (
    <div className="admin-section">
      <h3>Group Information</h3>

      <table className="admin-table">
        <tbody>
          <tr>
            <td>Group Name</td>
            <td>{group.groupName}</td>
          </tr>

          <tr>
            <td>Group Admin</td>
            <td>{group.groupAdminName}</td>
          </tr>

          <tr>
            <td>Total Members</td>
            <td>{group.memberCount}</td>
          </tr>

          <tr>
            <td>Created Date</td>
            <td>
              {new Date(
                group.createdAt
              ).toLocaleDateString()}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default GroupInfo;