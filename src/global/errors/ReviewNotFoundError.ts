export class ReviewNotFoundError extends Error {
  constructor(reviewId: string) {
    super(`Review not found for ID: ${reviewId}`);
    this.name = 'UserNotFoundError';
    Object.setPrototypeOf(this, ReviewNotFoundError.prototype);
  }
}