import { Prisma, ServiceSubType } from '@prisma/client'

export interface IServiceSubTypesRepository {
  create(data: Prisma.ServiceSubTypeCreateInput): Promise<ServiceSubType>
  findById(id: number): Promise<ServiceSubType | null>
  findByParentId(parentId: number): Promise<ServiceSubType[]>
}
