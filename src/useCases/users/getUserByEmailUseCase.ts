import { IUsersRepository } from "@/repositories/users/IUsersRepository"
import { User } from "@prisma/client"
import { UserNotFoundError } from "./errors/UserNotFoundError"

export class GetUserByEmailUseCase {
  constructor(private usersRepository: IUsersRepository) { }

  async execute(email: string): Promise<User> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new UserNotFoundError(email)
    }

    return user
  }
}
