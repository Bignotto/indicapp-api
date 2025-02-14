import { InMemoryServiceTypesRepository } from '@/repositories/serviceTypes/InMemory/InMemoryServiceTypesRepository'
import { CreateServiceTypeUseCase } from '../createServiceTypeUseCase'

export function makeCreateServiceTypeUseCase(): CreateServiceTypeUseCase {
  const repository = new InMemoryServiceTypesRepository()
  return new CreateServiceTypeUseCase(repository)
}
