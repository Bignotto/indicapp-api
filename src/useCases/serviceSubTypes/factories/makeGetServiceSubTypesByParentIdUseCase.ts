import { PrismaServiceSubTypesRepository } from '@/repositories/serviceSubTypes/Prisma/PrismaServiceSubTypesRepository'
import { GetServiceSubTypesByParentIdUseCase } from '../getServiceSubTypesByParentIdUseCase'

export function makeGetServiceSubTypesByParentIdUseCase() {
  const serviceSubTypesRepository = new PrismaServiceSubTypesRepository()
  const getServiceSubTypesByParentIdUseCase =
    new GetServiceSubTypesByParentIdUseCase(serviceSubTypesRepository)

  return getServiceSubTypesByParentIdUseCase
}
