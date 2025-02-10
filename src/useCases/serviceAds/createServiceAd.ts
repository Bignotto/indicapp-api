import { UserNotFoundError } from "@/global/errors/UserNotFoundError"
import { IServiceAdsRepository } from "@/repositories/serviceAds/IServiceAdsRepository"
import { IUsersRepository } from "@/repositories/users/IUsersRepository"
import { ProviderServiceAd } from "@prisma/client"

interface CreateServiceAdRequest {
  providerId: string
  title: string
  description: string
  value: number
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
  }: CreateServiceAdRequest): Promise<CreateServiceAdResponse> {
    const user = await this.usersRepository.findById(providerId)

    if (!user) {
      throw new UserNotFoundError(providerId)
    }

    const serviceAd = await this.serviceAdsRepository.create({
      title,
      description,
      value,
      provider: {
        connect: {
          id: user.id,
        },
      },
    })

    return {
      serviceAd,
    }
  }
}
