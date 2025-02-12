import { UserNotFoundError } from "@/global/errors/UserNotFoundError"
import { IServiceAdsRepository } from "@/repositories/serviceAds/IServiceAdsRepository"
import { IUsersRepository } from "@/repositories/users/IUsersRepository"
import { ProviderServiceAd } from "@prisma/client"

interface CreateServiceAdRequest {
  providerId: string
  title: string
  description: string
  value: number
  serviceType: number
  serviceSubType: number
}

interface CreateServiceAdResponse {
  serviceAd: ProviderServiceAd
}

export class CreateServiceAdUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private serviceAdsRepository: IServiceAdsRepository,
  ) { }

  async execute({
    providerId,
    title,
    description,
    value,
    serviceType,
    serviceSubType
  }: CreateServiceAdRequest): Promise<CreateServiceAdResponse> {
    const user = await this.usersRepository.findById(providerId)

    if (!user) {
      throw new UserNotFoundError(providerId)
    }

    const today = new Date()
    const validTo = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate())

    const serviceAd = await this.serviceAdsRepository.create({
      title,
      description,
      value,
      provider: {
        connect: {
          id: user.id,
        },
      },
      validTo,
      validFrom: today,
      serviceType: {
        connect: {
          id: serviceType,
        }
      },
      serviceSubType: {
        connect: {
          id: serviceSubType,
        }
      }
    })

    return {
      serviceAd,
    }

  }
}
