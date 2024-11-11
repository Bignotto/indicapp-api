import { IUsersRepository } from "@/repositories/users/IUsersRepository"
import { User } from "@prisma/client"
import { InvalidPhoneNumberError } from "./errors/InvalidPhoneNumberError"
import { UserNotFoundError } from "./errors/UserNotFoundError"

interface UpdateUserUseCaseRequest {
  userId: string
  name?: string
  email?: string
  phone?: string
  image?: string
}

export class UpdateUserUseCase {
  constructor(private usersRepository: IUsersRepository) { }

  async execute({
    userId,
    name,
    email,
    phone,
    image,
  }: UpdateUserUseCaseRequest): Promise<User> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError(userId)
    }

    if (phone) {
      const phoneRegex = /^\+[1-9]\d{10,14}$/
      if (!phoneRegex.test(phone)) {
        throw new InvalidPhoneNumberError()
      }
    }

    const updatedUser = await this.usersRepository.update(userId, {
      name: name ?? user.name,
      email: email ?? user.email,
      phone: phone ?? user.phone,
      image: image ?? `${user.image}`,
    })

    return updatedUser
  }
}
