import { IUsersRepository } from "@/repositories/users/IUsersRepository"
import { User } from "@prisma/client"
import { UserNotFoundError } from "./errors/UserNotFoundError"

export class GetUserByIdUseCase {
  constructor(private usersRepository: IUsersRepository) { }

  async execute(userId: string): Promise<User> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError(userId)
    }

    return user
  }
}
