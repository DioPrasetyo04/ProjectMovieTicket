import { User } from "../fitur_interfaces/InterfaceUser";
import IUserRepositories from "../interfaces/IUserRepositories";
import InterfaceUser from "../interfaces/IUserRepositories";

export class UserService {
  private userService: any;

  constructor(private userRepositories: IUserRepositories) {
    this.userService = userRepositories;
  }

  async getAllDataUser() {
    return await this.userService.getAllDataUser();
  }

  async findDetailDataUser(email: string) {
    return await this.userService.findDetailDataUser(email);
  }

  async postDataUser(data: User) {
    return await this.userService.postDataUser(data);
  }

  async updateDataUser(email: string, data: Partial<User>) {
    const findUser = await this.userService.findDetailDataUser(email);
    if (!findUser) {
      throw new Error("User not found");
    }
    return await this.userService.updateDataUser(email, data);
  }

  async deleteDataUser(email: string) {
    const findUser = await this.userService.findDetailDataUser(email);
    if (!findUser) {
      throw new Error("User not found");
    }
    return await this.userService.deleteDataUser(email);
  }
}
