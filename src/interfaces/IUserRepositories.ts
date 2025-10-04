import { User } from "../fitur_interfaces/InterfaceUser";

interface IUserRepositories {
  getAllDataUser(): Promise<User[] | null>;
  findDetailDataUser(email: string): Promise<User | null>;
  postDataUser(data: User): Promise<User | null>;
  updateDataUser(email: string, data: Partial<User>): Promise<User | null>;
  deleteDataUser(email: string): Promise<boolean | null>;
}

export default IUserRepositories;
