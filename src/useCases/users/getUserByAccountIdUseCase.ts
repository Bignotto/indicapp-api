import { IUsersRepository } from "@/repositories/users/IUsersRepository"
import { User } from "@prisma/client"
import { UserNotFoundError } from "./errors/UserNotFoundError"

export class GetUserByAccountIdUseCase {
  constructor(private usersRepository: IUsersRepository) { }

  async execute(accountId: string): Promise<User> {
    const user = await this.usersRepository.findByAccountId(accountId)

    if (!user) {
      throw new UserNotFoundError(accountId)
    }

    return user
  }
}
