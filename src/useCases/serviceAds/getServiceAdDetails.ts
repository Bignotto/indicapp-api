import { ServiceAdNotFoundError } from "@/global/errors/ServiceAdNotFoundError"
import { IServiceAdsRepository } from "@/repositories/serviceAds/IServiceAdsRepository"
import { ProviderServiceAd } from "@prisma/client"

interface GetServiceAdDetailsResponse {
  serviceAd: ProviderServiceAd
}

export class GetServiceAdDetailsUseCase {
  constructor(
    private serviceAdsRepository: IServiceAdsRepository,
  ) { }

  async execute(serviceAdId: string): Promise<GetServiceAdDetailsResponse> {
    const serviceAd = await this.serviceAdsRepository.findById(serviceAdId)

    if (!serviceAd) {
      throw new ServiceAdNotFoundError(serviceAdId)
    }

    return {
      serviceAd,
    }
  }
}
