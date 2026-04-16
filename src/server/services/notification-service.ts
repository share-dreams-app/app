type CreateNotificationInput = {
  userId: string;
  title: string;
  body: string;
};

let notificationSequence = 0;

export async function createNotification(input: CreateNotificationInput) {
  notificationSequence += 1;

  return {
    id: `notification_${notificationSequence}`,
    userId: input.userId,
    title: input.title,
    body: input.body,
    readAt: null,
    createdAt: new Date()
  };
}
