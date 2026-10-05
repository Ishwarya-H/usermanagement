const Notification = require(
  "../models/Notification"
);

exports.getNotifications =
  async (req, res) => {
    try {
      console.log(
        "Logged User:",
        req.user.id
      );

      const notifications =
        await Notification.find({
          userId: req.user.id,
        }).sort({
          createdAt: -1,
        })
        .limit(10);
      console.log(
        "Notifications:",
        notifications
      );

      res.json(notifications);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Server error",
      });
    }
  };

exports.markAsRead =
  async (req, res) => {
    try {
      const notification =
        await Notification.findById(
          req.params.id
        );

      if (!notification) {
        return res.status(404).json({
          message:
            "Notification not found",
        });
      }

      notification.isRead = true;

      await notification.save();

      res.json({
        message:
          "Notification marked as read",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Server error",
      });
    }
  };