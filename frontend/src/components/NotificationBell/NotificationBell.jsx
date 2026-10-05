import { useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationAsRead,
} from "../../api/notificationApi";

function NotificationBell() {
  const [notifications, setNotifications] =
    useState([]);

  const [showBox, setShowBox] =
    useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications =
    async () => {
      try {
        const res =
          await getNotifications();

        setNotifications(
          res.data
        );
      } catch (error) {
        console.log(error);
      }
    };

  const handleNotificationClick =
    async (id) => {
      try {
        await markNotificationAsRead(
          id
        );

        setNotifications((prev) =>
          prev.map(
            (notification) =>
              notification._id === id
                ? {
                    ...notification,
                    isRead: true,
                  }
                : notification
          )
        );
      } catch (error) {
        console.log(error);
      }
    };

  const unreadCount =
    notifications.filter(
      (n) => !n.isRead
    ).length;

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <button
        className="notification-btn"
        onClick={() =>
          setShowBox(!showBox)
        }
      >
        🔔

        {unreadCount > 0 && (
          <span className="notification-count">
            {unreadCount}
          </span>
        )}
      </button>

      {showBox && (
        <div className="notification-box">
          <div className="notification-header">
            Notifications
          </div>

          {notifications.length ===
          0 ? (
            <div className="notification-empty">
              No Notifications
            </div>
          ) : (
            notifications.map(
              (notification) => (
                <div
                  key={
                    notification._id
                  }
                  className={`notification-item ${
                    notification.isRead
                      ? "read-notification"
                      : "unread-notification"
                  }`}
                  onClick={() =>
                    handleNotificationClick(
                      notification._id
                    )
                  }
                >
                  🔔{" "}
                  {
                    notification.message
                  }

                  <span className="notification-time">
                    {new Date(
                      notification.createdAt
                    ).toLocaleString()}
                  </span>
                </div>
              )
            )
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;