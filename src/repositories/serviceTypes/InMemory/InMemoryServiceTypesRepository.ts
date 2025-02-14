import { Prisma, ServiceType } from '@prisma/client'
import { IServiceTypesRepository } from '../IServiceTypesRepository'

export class InMemoryServiceTypesRepository implements IServiceTypesRepository {
  public serviceTypes: ServiceType[] = []

  async create(data: Prisma.ServiceTypeCreateInput): Promise<ServiceType> {
    const serviceType: ServiceType = {
      id: this.serviceTypes.length + 1,
      name: data.name,
      description: data.description,
    }

    this.serviceTypes.push(serviceType)
    return serviceType
  }
}
