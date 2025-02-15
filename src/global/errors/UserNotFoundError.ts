export class UserNotFoundError extends Error {
  constructor(providerId: string) {
    super(`User not found for user ID: ${providerId}`);
    this.name = 'UserNotFoundError';
    Object.setPrototypeOf(this, UserNotFoundError.prototype);
  }
}
