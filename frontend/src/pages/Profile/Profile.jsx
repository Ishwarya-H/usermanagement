import { useEffect, useState } from "react";
import {
  getProfile,
  updateProfile,
  changePassword,
} from "../../api/userApi";

function Profile() {
  const [profile, setProfile] =
    useState(null);

  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response =
        await getProfile();

      setProfile(response.data);
      setFirstName(
        response.data.firstName
      );
      setLastName(
        response.data.lastName
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateProfile =
    async () => {
      try {
        const response =
          await updateProfile({
            firstName,
            lastName,
          });

        setProfile(
          response.data.user
        );

        setMessage(
          "Profile updated successfully"
        );
      } catch (error) {
        console.error(error);
      }
    };

  const handleChangePassword =
    async () => {
      if (
        newPassword !==
        confirmPassword
      ) {
        setMessage(
          "Passwords do not match"
        );
        return;
      }

      try {
        const response =
          await changePassword({
            currentPassword,
            newPassword,
          });

        setMessage(
          response.data.message
        );

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } catch (error) {
        setMessage(
          error.response?.data
            ?.message ||
            "Failed to change password"
        );
      }
    };

  if (!profile) {
    return <p>Loading...</p>;
  }

  return (
    <div className="page-card">
      <h2>My Profile</h2>

      {message && (
        <div
          style={{
            marginBottom: "15px",
            padding: "10px",
            background:
              "#e8f5e9",
            color: "#2e7d32",
            borderRadius: "6px",
          }}
        >
          {message}
        </div>
      )}

      <div className="admin-section">
        <h3>
          Personal Information
        </h3>

        <table className="admin-table">
          <tbody>
            <tr>
              <td>
                First Name
              </td>
              <td>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) =>
                    setFirstName(
                      e.target.value
                    )
                  }
                />
              </td>
            </tr>

            <tr>
              <td>
                Last Name
              </td>
              <td>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) =>
                    setLastName(
                      e.target.value
                    )
                  }
                />
              </td>
            </tr>

            <tr>
              <td>Email</td>
              <td>
                {profile.email}
              </td>
            </tr>

            <tr>
              <td>Role</td>
              <td>
                {profile.role}
              </td>
            </tr>

            <tr>
              <td>Status</td>
              <td>
                {profile.isActive
                  ? "Active"
                  : "Inactive"}
              </td>
            </tr>

            <tr>
              <td>
                Member Since
              </td>
              <td>
                {new Date(
                  profile.createdAt
                ).toLocaleDateString()}
              </td>
            </tr>
          </tbody>
        </table>

        <button
          className="table-btn table-btn--approve"
          onClick={
            handleUpdateProfile
          }
          style={{
            marginTop: "15px",
          }}
        >
          Save Changes
        </button>
      </div>

      <div
        className="admin-section"
        style={{
          marginTop: "30px",
        }}
      >
        <h3>
          Change Password
        </h3>

        <table className="admin-table">
          <tbody>
            <tr>
              <td>
                Current Password
              </td>

              <td>
                <input
                  type="password"
                  value={
                    currentPassword
                  }
                  onChange={(e) =>
                    setCurrentPassword(
                      e.target.value
                    )
                  }
                />
              </td>
            </tr>

            <tr>
              <td>
                New Password
              </td>

              <td>
                <input
                  type="password"
                  value={
                    newPassword
                  }
                  onChange={(e) =>
                    setNewPassword(
                      e.target.value
                    )
                  }
                />
              </td>
            </tr>

            <tr>
              <td>
                Confirm Password
              </td>

              <td>
                <input
                  type="password"
                  value={
                    confirmPassword
                  }
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                />
              </td>
            </tr>
          </tbody>
        </table>

        <button
          className="table-btn table-btn--approve"
          onClick={
            handleChangePassword
          }
          style={{
            marginTop: "15px",
          }}
        >
          Change Password
        </button>
      </div>
    </div>
  );
}

export default Profile;