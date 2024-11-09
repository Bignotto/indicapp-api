import { IUsersRepository } from "@/repositories/users/IUsersRepository";
import { AccountProvider, User } from "@prisma/client";
import { EmailAlreadyInUseError } from "./errors/EmailAlreadyInUseError";
import { InvalidPhoneNumberError } from "./errors/InvalidPhoneNumberError";

interface CreateNewUserRequest {
  name: string
  email: string
  phone: string
  accountProvider: AccountProvider
}

interface CreateNewUserResponse {
  user: User
}

export class CreateUserUseCase {
  constructor(
    private usersRepository: IUsersRepository
  ) { }

  async execute({
    name, email, phone, accountProvider
  }: CreateNewUserRequest): Promise<CreateNewUserResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)
    if (userWithSameEmail) {
      throw new EmailAlreadyInUseError()
    }

    const cleanedPhone = phone.replace(/[^0-9]/g, '')
    if (cleanedPhone.length !== 11) throw new InvalidPhoneNumberError()

    const user = await this.usersRepository.create({
      name,
      email,
      phone: cleanedPhone,
      accountProvider
    })

    return { user }
  }
}