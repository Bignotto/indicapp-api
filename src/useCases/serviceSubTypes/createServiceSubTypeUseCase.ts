import { IServiceSubTypesRepository } from '@/repositories/serviceSubTypes/IServiceSubTypesRepository'
import { IServiceTypesRepository } from '@/repositories/serviceTypes/IServiceTypesRepository'
import { ServiceSubType } from '@prisma/client'
import { ParentServiceTypeNotFound } from './errors/ParentServiceTypeNotFoundError'

export interface CreateServiceSubTypeUseCaseRequest {
  name: string
  description: string
  parentServiceTypeId: number
}

export interface CreateServiceSubTypeUseCaseResponse {
  serviceSubType: ServiceSubType
}

export class CreateServiceSubTypeUseCase {
  constructor(
    private serviceSubTypesRepository: IServiceSubTypesRepository,
    private serviceTypesRepository: IServiceTypesRepository,
  ) { }

  async execute({
    name,
    description,
    parentServiceTypeId,
  }: CreateServiceSubTypeUseCaseRequest): Promise<CreateServiceSubTypeUseCaseResponse> {
    // Check if the parent service type exists.
    const parentServiceType = await this.serviceTypesRepository.findById(parentServiceTypeId)
    if (!parentServiceType) {
      throw new ParentServiceTypeNotFound(parentServiceTypeId.toString())
    }

    const serviceSubType = await this.serviceSubTypesRepository.create({
      name,
      description,
      parentType: {
        connect: {
          id: parentServiceTypeId,
        },
      }
    })

    return { serviceSubType }
  }
}
