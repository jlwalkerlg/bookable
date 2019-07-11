import React from 'react';
import { connect } from 'react-redux';
import Notification from './Notification';
import { removeNotification } from '../actions/notifications';

const Notifications = ({ notifications, removeNotification }) => {
  const handleClose = notification => removeNotification(notification.id);

  return (
    <div className="notifications" aria-live="polite" aria-atomic="true">
      {notifications.map(notification => {
        return (
          <Notification
            key={notification.id}
            notification={notification}
            onClose={handleClose}
          />
        );
      })}
    </div>
  );
};

const mapStateToProps = ({ notifications }) => ({
  notifications
});

const mapDispatchToProps = {
  removeNotification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notifications);
