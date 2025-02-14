import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryServiceSubTypesRepository } from '@/repositories/serviceSubTypes/InMemory/InMemoryServiceSubTypesRepository'
import { InMemoryServiceTypesRepository } from '@/repositories/serviceTypes/InMemory/InMemoryServiceTypesRepository'
import { CreateServiceSubTypeUseCase } from './createServiceSubTypeUseCase'
import { ParentServiceTypeNotFound } from './errors/ParentServiceTypeNotFoundError'

describe('Create Service Sub Type Use Case', () => {
  let sut: CreateServiceSubTypeUseCase
  let serviceSubTypesRepository: InMemoryServiceSubTypesRepository
  let serviceTypesRepository: InMemoryServiceTypesRepository

  beforeEach(() => {
    serviceSubTypesRepository = new InMemoryServiceSubTypesRepository()
    serviceTypesRepository = new InMemoryServiceTypesRepository()
    sut = new CreateServiceSubTypeUseCase(
      serviceSubTypesRepository,
      serviceTypesRepository,
    )
  })

  it('should create a new service sub type', async () => {
    const parentType = await serviceTypesRepository.create({
      name: 'Construction',
      description: 'Construction services',
    })

    const { serviceSubType } = await sut.execute({
      name: 'Painting',
      description: 'Interior and exterior painting',
      parentServiceTypeId: parentType.id,
    })

    expect(serviceSubType.id).toEqual(1)
    expect(serviceSubType.name).toEqual('Painting')
    expect(serviceSubType.description).toEqual('Interior and exterior painting')
  })

  it('should not create a service sub type with invalid parent type id', async () => {
    await expect(() =>
      sut.execute({
        name: 'Painting',
        description: 'Interior and exterior painting',
        parentServiceTypeId: 999,
      }),
    ).rejects.toBeInstanceOf(ParentServiceTypeNotFound)
  })

  it('should create service sub type with correct parent type relationship', async () => {
    const parentType = await serviceTypesRepository.create({
      name: 'Construction',
      description: 'Construction services',
    })

    const { serviceSubType } = await sut.execute({
      name: 'Painting',
      description: 'Interior and exterior painting',
      parentServiceTypeId: parentType.id,
    })

    expect(serviceSubType.parentTypeId).toEqual(parentType.id)
  })
})
