import { Prisma, ProviderServiceAd } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { IServiceAdsRepository } from '../IServiceAdsRepository'

export class InMemoryServiceAdsRepository implements IServiceAdsRepository {
  public items: ProviderServiceAd[] = []

  async create(data: Prisma.ProviderServiceAdCreateInput): Promise<ProviderServiceAd> {
    const serviceAd: ProviderServiceAd = {
      id: randomUUID(),
      title: data.title,
      description: data.description,
      value: data.value,
      providerId: data.provider.connect?.id ?? '',
      serviceTypeId: 1,
      serviceSubTypeId: 1,
      serviceClass: 'SERVICE',
      validFrom: new Date(),
      validTo: new Date(new Date().getFullYear() + 1, 11, 31),
      createdAt: new Date(),
      updatedAt: new Date(),

    }

    this.items.push(serviceAd)
    return serviceAd
  }

  async findById(id: string): Promise<ProviderServiceAd | null> {
    const serviceAd = this.items.find(item => item.id === id)
    if (!serviceAd) return null
    return serviceAd
  }

  async findByUserId(userId: string): Promise<ProviderServiceAd[]> {
    const serviceAds = this.items.filter(item => item.providerId === userId)
    return serviceAds
  }

  async update(id: string, data: Prisma.ProviderServiceAdUpdateInput): Promise<ProviderServiceAd> {
    const serviceAdIndex = this.items.findIndex(item => item.id === id)

    if (serviceAdIndex >= 0) {
      const serviceAd = this.items[serviceAdIndex]

      this.items[serviceAdIndex] = {
        ...serviceAd,
        title: data.title as string ?? serviceAd.title,
        description: data.description as string ?? serviceAd.description,
        value: data.value as number ?? serviceAd.value,
        updatedAt: new Date(),
      }

      return this.items[serviceAdIndex]
    }

    throw new Error('Service ad not found')
  }

  async delete(id: string): Promise<void> {
    const serviceAdIndex = this.items.findIndex(item => item.id === id)

    if (serviceAdIndex >= 0) {
      this.items.splice(serviceAdIndex, 1)
    }
  }
}
