import { ADD_NOTIFICATION, REMOVE_NOTIFICATION } from '../actions/types';

function notificationsReducer(notifications = [], action) {
  switch (action.type) {
    case ADD_NOTIFICATION:
      return [...notifications, action.notification];
    case REMOVE_NOTIFICATION:
      return notifications.filter(
        notification => notification.id !== action.id
      );
    default:
      return notifications;
  }
}

export default notificationsReducer;
