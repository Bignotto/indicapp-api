import { Prisma, ServiceSubType } from '@prisma/client'
import { IServiceSubTypesRepository } from '../IServiceSubTypesRepository'

export class InMemoryServiceSubTypesRepository implements IServiceSubTypesRepository {
  public serviceSubTypes: ServiceSubType[] = []

  async create(data: Prisma.ServiceSubTypeCreateInput): Promise<ServiceSubType> {
    const newServiceSubType: ServiceSubType = {
      id: this.serviceSubTypes.length + 1,
      name: data.name,
      description: data.description ?? '',
      parentTypeId: data.parentType.connect?.id ?? 0,
    }
    this.serviceSubTypes.push(newServiceSubType)
    return newServiceSubType
  }
}
