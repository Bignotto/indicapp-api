export class EmailAlreadyInUseError extends Error {
    constructor() {
      super('E-Mail already in use.')
    }
  }