import { Prisma, ServiceSubType } from '@prisma/client'

export interface IServiceSubTypesRepository {
  create(data: Prisma.ServiceSubTypeCreateInput): Promise<ServiceSubType>
}
