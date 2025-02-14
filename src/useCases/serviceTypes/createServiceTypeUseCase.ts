
import { IServiceTypesRepository } from '@/repositories/serviceTypes/IServiceTypesRepository'
import { ServiceType } from '@prisma/client'

interface CreateServiceTypeUseCaseRequest {
  name: string
  description: string
}

interface CreateServiceTypeUseCaseResponse {
  serviceType: ServiceType
}

export class CreateServiceTypeUseCase {
  constructor(private serviceTypesRepository: IServiceTypesRepository) { }

  async execute({
    name,
    description,
  }: CreateServiceTypeUseCaseRequest): Promise<CreateServiceTypeUseCaseResponse> {
    const serviceType = await this.serviceTypesRepository.create({
      name,
      description,
    })

    return {
      serviceType,
    }
  }
}
