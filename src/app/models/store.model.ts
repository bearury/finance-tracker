import { TransactionModel } from '@models/transaction.model';

export interface Store {
  transactions: TransactionModel[];
  currentUpdatedTransaction: TransactionModel | null;
}
