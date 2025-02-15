import { InMemoryServiceTypesRepository } from '@/repositories/serviceTypes/InMemory/InMemoryServiceTypesRepository'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetServiceTypesUseCase } from './getServiceTypesUseCase'

let serviceTypesRepository: InMemoryServiceTypesRepository
let sut: GetServiceTypesUseCase

describe('Get Service Types Use Case', () => {
  beforeEach(() => {
    serviceTypesRepository = new InMemoryServiceTypesRepository()
    sut = new GetServiceTypesUseCase(serviceTypesRepository)
  })

  it('should return all service types', async () => {
    // Populate repository with test data
    serviceTypesRepository.serviceTypes.push(
      {
        id: 1,
        name: 'Service Type 1',
        description: 'Description 1',
      },
      {
        id: 2,
        name: 'Service Type 2',
        description: 'Description 2',
      },
    )

    const { serviceTypes } = await sut.execute()

    expect(serviceTypes).toHaveLength(2)
    expect(serviceTypes).toEqual([
      expect.objectContaining({ name: 'Service Type 1' }),
      expect.objectContaining({ name: 'Service Type 2' }),
    ])
  })

  it('should return empty array when no service types exist', async () => {
    const { serviceTypes } = await sut.execute()

    expect(serviceTypes).toHaveLength(0)
    expect(serviceTypes).toEqual([])
  })
})
