import { prisma } from '@/lib/prisma'
import { Prisma, ServiceType } from '@prisma/client'
import { IServiceTypesRepository } from '../IServiceTypesRepository'

export class PrismaServiceTypesRepository implements IServiceTypesRepository {
  async create(data: Prisma.ServiceTypeCreateInput): Promise<ServiceType> {
    const serviceType = await prisma.serviceType.create({
      data
    })

    return serviceType
  }

  async findById(id: number): Promise<ServiceType | null> {
    const serviceType = await prisma.serviceType.findUnique({
      where: {
        id
      }
    })
    return serviceType || null
  }

  async findAll(): Promise<ServiceType[]> {
    const serviceTypes = await prisma.serviceType.findMany()
    return serviceTypes
  }
}