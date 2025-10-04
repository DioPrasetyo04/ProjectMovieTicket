import { User } from "../fitur_interfaces/InterfaceUser";
import IUserRepositories from "../interfaces/IUserRepositories";
import UsersModel from "../models/UsersModel";

export class UserRepositories implements IUserRepositories {
  async getAllDataUser(): Promise<User[] | null> {
    return await UsersModel.find({ role: "customer" }).select("name email");
  }

  async findDetailDataUser(email: string): Promise<User | null> {
    const findUser = await UsersModel.findOne({ email })
      .findOne({
        role: "customer",
      })
      .select("name email");
    return findUser;
  }

  async postDataUser(data: User): Promise<User | null> {
    const createDataUser = await UsersModel.create(data);
    return createDataUser.save();
  }

  async updateDataUser(
    email: string,
    data: Partial<User>
  ): Promise<User | null> {
    return await UsersModel.findOneAndUpdate({ email }, data, { new: true });
  }

  async deleteDataUser(email: string): Promise<boolean | null> {
    return !!(await UsersModel.findOneAndDelete({ email }));
  }
}
