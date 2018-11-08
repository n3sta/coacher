import Notification from './../models/Notification';
import NotificationObject from './../models/NotificationObject';
import NotificationChange from './../models/NotificationChange';

export const setNotification = async (data) => {
    const notificationObject = await new NotificationObject({
        entityType: data.entityType,
        entityId: data.entityId,
    }).save();
    await new NotificationChange({
        actor: data.actor,
        notificationObject: notificationObject._id,
    }).save();
    await new Notification({
        notifier: data.notifier,
        notificationObject: notificationObject._id,
    }).save();
}