import { IServiceTypesRepository } from "@/repositories/serviceTypes/IServiceTypesRepository"
import { ServiceType } from "@prisma/client"

interface GetServiceTypesUseCaseResponse {
  serviceTypes: ServiceType[]
}

export class GetServiceTypesUseCase {
  constructor(
    private serviceTypesRepository: IServiceTypesRepository
  ) { }

  async execute(): Promise<GetServiceTypesUseCaseResponse> {
    const serviceTypes = await this.serviceTypesRepository.findAll()

    return {
      serviceTypes
    }
  }
}
