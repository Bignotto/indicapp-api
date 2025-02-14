import { PrismaServiceSubTypesRepository } from '@/repositories/serviceSubTypes/Prisma/PrismaServiceSubTypesRepository'
import { PrismaServiceTypesRepository } from '@/repositories/serviceTypes/Prisma/PrismaServiceTypesRepository'
import { CreateServiceSubTypeUseCase } from '@/useCases/serviceSubTypes/createServiceSubTypeUseCase'

export function makeCreateServiceSubTypeUseCase(): CreateServiceSubTypeUseCase {
  const serviceSubTypesRepository = new PrismaServiceSubTypesRepository()
  const serviceTypesRepository = new PrismaServiceTypesRepository()

  const createServiceSubTypeUseCase = new CreateServiceSubTypeUseCase(
    serviceSubTypesRepository,
    serviceTypesRepository,
  )

  return createServiceSubTypeUseCase
}
