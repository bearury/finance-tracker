import { computed, Injectable, signal } from '@angular/core';
import { Store } from '@models/store.model';
import { TransactionModel } from '@models/transaction.model';

const initialState: Store = {
  transactions: [],
  currentUpdatedTransaction: null,
};

@Injectable({ providedIn: 'root' })
export class StateService {
  private readonly state = signal<Store>(initialState);
  public readonly transactionsState = computed<TransactionModel[]>(() => {
    return this.state().transactions.sort((a, b) => {
      const dateA = new Date(a.date.split('.').reverse().join('-'));
      const dateB = new Date(b.date.split('.').reverse().join('-'));

      return dateA.getTime() - dateB.getTime();
    });
  });
  public readonly currentTransactionsState = computed<TransactionModel | null>(
    () => this.state().currentUpdatedTransaction
  );
  public readonly transactions = computed<TransactionModel | null>(
    () => this.state().currentUpdatedTransaction
  );

  public setTransactions(transactions: TransactionModel[]): void {
    this.state.update((state) => ({ ...state, transactions }));
  }

  public setCurrentUpdatedTransactions(
    currentUpdatedTransaction: TransactionModel | null
  ): void {
    this.state.update((state) => ({ ...state, currentUpdatedTransaction }));
  }

  public addTransaction(transaction: TransactionModel): void {
    this.state.update((state) => ({
      ...state,
      transactions: [...state.transactions, transaction],
    }));
  }

  public updateTransaction(transaction: TransactionModel): void {
    this.state.update((state) => ({
      ...state,
      transactions: state.transactions.map((tr) =>
        tr.id === transaction.id ? transaction : tr
      ),
    }));
  }

  public removeTransaction(transactionId: string): void {
    this.state.update((state) => ({
      ...state,
      transactions: state.transactions.filter(
        (transaction) => transaction.id !== transactionId
      ),
    }));
  }
}
