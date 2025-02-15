export class ServiceAdNotFoundError extends Error {
  constructor(serviceAdId: string) {
    super(`Service ad ID: ${serviceAdId}`);
    this.name = 'ServiceAdNotFound';
    Object.setPrototypeOf(this, ServiceAdNotFoundError.prototype);
  }
}
