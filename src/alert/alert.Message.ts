export class FCMTokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FCMTokenError';
  }
}

export class NotificationNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotificationNotFoundError';
  }
}

export class UserNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserNotFoundError';
  }
}
