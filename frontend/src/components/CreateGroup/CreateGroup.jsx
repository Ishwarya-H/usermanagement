import { useState } from "react";
import { createGroup } from "../../api/groupApi";

function CreateGroup() {
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateGroup = async (e) => {
    e.preventDefault();

    if (!groupName.trim()) {
      alert("Group name is required");
      return;
    }

    try {
      setLoading(true);

      const response = await createGroup({
        groupName: groupName.trim(),
      });

      alert(response.data.message);

      setGroupName("");

      window.location.reload();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to create group"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-section">
      <h3>Create Group</h3>

      <form onSubmit={handleCreateGroup}>
        <div className="input-group">
          <label>Group Name</label>

          <input
            type="text"
            placeholder="Enter group name"
            value={groupName}
            onChange={(e) =>
              setGroupName(e.target.value)
            }
          />
        </div>

        <button
          type="submit"
          className="table-btn table-btn--approve"
          disabled={loading}
        >
          {loading
            ? "Creating..."
            : "Create Group"}
        </button>
      </form>
    </div>
  );
}

export default CreateGroup;