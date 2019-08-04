import { ADD_NOTIFICATION, REMOVE_NOTIFICATION } from './types';

let id = 0;

export const addNotification = (message, options = { autohide: true }) => ({
  type: ADD_NOTIFICATION,
  notification: {
    id: id++,
    message,
    ...options,
  },
});

export const removeNotification = id => ({
  type: REMOVE_NOTIFICATION,
  id,
});
