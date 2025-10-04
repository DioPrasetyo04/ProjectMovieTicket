import { TransactionSeat } from "../fitur_interfaces/InterfaceTransaction";

interface ITransactionRepositories {
  findAllDataTransaction(): Promise<TransactionSeat[] | null>;
}

export default ITransactionRepositories;
