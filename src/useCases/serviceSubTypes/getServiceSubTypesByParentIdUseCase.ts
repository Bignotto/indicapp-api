import { IServiceSubTypesRepository } from "@/repositories/serviceSubTypes/IServiceSubTypesRepository"
import { ServiceSubType } from "@prisma/client"


interface GetServiceSubTypesByParentIdUseCaseRequest {
  parentId: number
}

interface GetServiceSubTypesByParentIdUseCaseResponse {
  serviceSubTypes: ServiceSubType[]
}

export class GetServiceSubTypesByParentIdUseCase {
  constructor(
    private serviceSubTypesRepository: IServiceSubTypesRepository
  ) { }

  async execute({
    parentId
  }: GetServiceSubTypesByParentIdUseCaseRequest): Promise<GetServiceSubTypesByParentIdUseCaseResponse> {
    const serviceSubTypes = await this.serviceSubTypesRepository.findByParentId(parentId)

    return {
      serviceSubTypes
    }
  }
}
