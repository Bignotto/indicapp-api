import { UserNotFoundError } from "@/global/errors/UserNotFoundError"
import { IServiceAdsRepository } from "@/repositories/serviceAds/IServiceAdsRepository"
import { IUsersRepository } from "@/repositories/users/IUsersRepository"
import { ProviderServiceAd } from "@prisma/client"

interface UpdateServiceAdRequest {
  serviceAdId: string
  providerId: string
  title?: string
  description?: string
  value?: number
  validTo?: Date
  serviceType?: number
  serviceSubType?: number
}

interface UpdateServiceAdResponse {
  serviceAd: ProviderServiceAd
}

export class UpdateServiceAdUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private serviceAdsRepository: IServiceAdsRepository,
  ) { }

  async execute({
    serviceAdId,
    providerId,
    title,
    description,
    value,
    validTo,
    serviceType,
    serviceSubType
  }: UpdateServiceAdRequest): Promise<UpdateServiceAdResponse> {
    const user = await this.usersRepository.findById(providerId)

    if (!user) {
      throw new UserNotFoundError(providerId)
    }

    const serviceAd = await this.serviceAdsRepository.update(serviceAdId, {
      title,
      description,
      value,
      validTo,
      serviceType: serviceType ? {
        connect: {
          id: serviceType,
        }
      } : undefined,
      serviceSubType: serviceSubType ? {
        connect: {
          id: serviceSubType,
        }
      } : undefined
    })

    return {
      serviceAd,
    }
  }
}
