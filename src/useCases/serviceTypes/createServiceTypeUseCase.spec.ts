import { describe, expect, it } from 'vitest'
import { makeCreateServiceTypeUseCase } from './factories/makeCreateServiceTypeUseCase'

describe('CreateServiceTypeUseCase', () => {
  it('should create a new service type', async () => {
    const createServiceTypeUseCase = makeCreateServiceTypeUseCase()

    const input = {
      name: 'Test Service',
      description: 'Test description',
    }
    const { serviceType } = await createServiceTypeUseCase.execute(input)

    expect(serviceType).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: input.name,
        description: input.description,
      }),
    )
  })
})
