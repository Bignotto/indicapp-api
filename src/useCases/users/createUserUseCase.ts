import { IUsersRepository } from "@/repositories/users/IUsersRepository";
import { AccountProvider, User } from "@prisma/client";
import { EmailAlreadyInUseError } from "./errors/EmailAlreadyInUseError";
import { InvalidPhoneNumberError } from "./errors/InvalidPhoneNumberError";

interface CreateNewUserRequest {
  id: string,
  name: string
  email: string
  phone?: string
  accountProvider: AccountProvider,
  accountId?: string,
  image?: string,
  phoneConfirmed?: boolean,
  emailConfirmed?: boolean,
}

interface CreateNewUserResponse {
  user: User
}

export class CreateUserUseCase {
  constructor(
    private usersRepository: IUsersRepository
  ) { }

  async execute({
    id, name, email, phone, accountProvider, accountId, image, phoneConfirmed, emailConfirmed
  }: CreateNewUserRequest): Promise<CreateNewUserResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)
    if (userWithSameEmail) {
      throw new EmailAlreadyInUseError()
    }
    let cleanedPhone;
    if (phone) {
      cleanedPhone = phone.replace(/[^0-9]/g, '')
      if (cleanedPhone.length !== 11) throw new InvalidPhoneNumberError()
    }

    const user = await this.usersRepository.create({
      id,
      name,
      email,
      phone: cleanedPhone,
      accountProvider,
      accountId,
      image,
      phoneConfirmed,
      emailConfirmed
    })

    return { user }
  }
}