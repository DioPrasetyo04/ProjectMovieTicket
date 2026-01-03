import { Transaction } from "../fitur_interfaces/InterfaceTransaction";

interface ITransactionRepositories {
  findAllDataTransaction(): Promise<Transaction[] | null>;
}

export default ITransactionRepositories;
