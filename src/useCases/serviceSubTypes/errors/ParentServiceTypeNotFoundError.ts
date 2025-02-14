export class ParentServiceTypeNotFound extends Error {
  constructor(parentServiceTypeId: string) {
    super(`Parent Service Type id not found: ${parentServiceTypeId}`);
    this.name = 'ParentServiceTypeNotFoundError';
    Object.setPrototypeOf(this, ParentServiceTypeNotFound.prototype);
  }
}