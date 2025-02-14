import { prisma } from '@/lib/prisma'; // adjust the path as needed
import { Prisma, ServiceSubType } from '@prisma/client'
import { IServiceSubTypesRepository } from '../IServiceSubTypesRepository'

export class PrismaServiceSubTypesRepository implements IServiceSubTypesRepository {
  async create(data: Prisma.ServiceSubTypeCreateInput): Promise<ServiceSubType> {
    const serviceSubType = await prisma.serviceSubType.create({
      data,
    })
    return serviceSubType
  }
}
