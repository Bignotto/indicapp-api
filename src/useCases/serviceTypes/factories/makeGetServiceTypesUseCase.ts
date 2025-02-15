import { PrismaServiceTypesRepository } from '@/repositories/serviceTypes/Prisma/PrismaServiceTypesRepository'
import { GetServiceTypesUseCase } from '@/useCases/serviceTypes/getServiceTypesUseCase'

export function makeGetServiceTypesUseCase() {
  const serviceTypesRepository = new PrismaServiceTypesRepository()
  const getServiceTypesUseCase = new GetServiceTypesUseCase(
    serviceTypesRepository,
  )

  return getServiceTypesUseCase
}
