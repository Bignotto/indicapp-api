import { IUsersRepository } from "@/repositories/users/IUsersRepository";
import { UserNotFoundError } from "./errors/UserNotFoundError";

// Delete User Use Case
export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUsersRepository) { }

  async execute(userId: string) {
    // Check if user exists
    const existingUser = await this.userRepository.findById(userId);

    if (!existingUser) {
      throw new UserNotFoundError(userId);
    }

    // Delete user
    await this.userRepository.delete(userId);

    return {
      success: true,
      message: `User ${userId} successfully deleted`
    };
  }
}