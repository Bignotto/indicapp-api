import { IUsersRepository } from "@/repositories/users/IUsersRepository";
import { User } from "@prisma/client";
import { InvalidPhoneNumberError } from "./errors/InvalidPhoneNumberError";
import { UserNotFoundError } from "./errors/UserNotFoundError";

interface UpdateUserPhoneUseCaseRequest {
  userId: string;
  phone: string;
  confirmed?: boolean;
}

export class UpdateUserPhoneUseCase {
  constructor(private usersRepository: IUsersRepository) { }

  async execute({
    userId,
    phone,
    confirmed = false
  }: UpdateUserPhoneUseCaseRequest): Promise<User> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError(userId)
    }

    const cleanedPhone = phone.replace(/[^0-9]/g, '')
    if (cleanedPhone.length !== 11) {
      throw new InvalidPhoneNumberError()
    }

    const updatedUser = await this.usersRepository.update(userId, {
      phone: cleanedPhone,
      phoneConfirmed: confirmed
    })

    return updatedUser
  }
}
