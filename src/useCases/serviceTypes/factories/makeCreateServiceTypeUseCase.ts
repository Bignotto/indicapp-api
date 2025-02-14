import { PrismaServiceTypesRepository } from '@/repositories/serviceTypes/Prisma/PrismaServiceTypesRepository'
import { CreateServiceTypeUseCase } from '../createServiceTypeUseCase'

export function makeCreateServiceTypeUseCase(): CreateServiceTypeUseCase {
  const repository = new PrismaServiceTypesRepository()
  return new CreateServiceTypeUseCase(repository)
}
