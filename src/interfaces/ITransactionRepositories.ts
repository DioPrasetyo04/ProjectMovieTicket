import type { TransactionSeat } from "../fitur_interfaces/InterfaceTransactionSeat";

interface ITransactionRepositories {
  findAllDataTransaction(): Promise<TransactionSeat[] | null>;
}

export default ITransactionRepositories;
