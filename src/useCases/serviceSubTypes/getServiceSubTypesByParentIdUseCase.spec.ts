import { InMemoryServiceSubTypesRepository } from '@/repositories/serviceSubTypes/InMemory/InMemoryServiceSubTypesRepository'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetServiceSubTypesByParentIdUseCase } from './getServiceSubTypesByParentIdUseCase'

let sut: GetServiceSubTypesByParentIdUseCase
let serviceSubTypesRepository: InMemoryServiceSubTypesRepository

describe('Get Service Sub Types By Parent ID Use Case', () => {
  beforeEach(() => {
    serviceSubTypesRepository = new InMemoryServiceSubTypesRepository()
    sut = new GetServiceSubTypesByParentIdUseCase(serviceSubTypesRepository)
  })

  it('should return empty array when no sub types found for parent id', async () => {
    const { serviceSubTypes } = await sut.execute({ parentId: 1 })
    expect(serviceSubTypes).toHaveLength(0)
  })

  it('should return all sub types for given parent id', async () => {
    // Create test data
    await serviceSubTypesRepository.create({
      name: 'Sub Type 1',
      description: 'Description 1',
      parentType: {
        connect: {
          id: 1,
        },
      },
    })

    await serviceSubTypesRepository.create({
      name: 'Sub Type 2',
      description: 'Description 2',
      parentType: {
        connect: {
          id: 2,
        },
      },
    })

    await serviceSubTypesRepository.create({
      name: 'Sub Type 3',
      description: 'Description 3',
      parentType: {
        connect: {
          id: 1,
        },
      },
    })

    const { serviceSubTypes } = await sut.execute({ parentId: 1 })

    expect(serviceSubTypes).toHaveLength(2)
    expect(serviceSubTypes).toEqual([
      expect.objectContaining({ name: 'Sub Type 1', parentTypeId: 1 }),
      expect.objectContaining({ name: 'Sub Type 3', parentTypeId: 1 }),
    ])
  })
})
