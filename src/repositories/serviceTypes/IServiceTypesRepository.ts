import { Prisma, ServiceType } from '@prisma/client';

export interface IServiceTypesRepository {
  create(data: Prisma.ServiceTypeCreateInput): Promise<ServiceType>
  findById(id: number): Promise<ServiceType | null>
}