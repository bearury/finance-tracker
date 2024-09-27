import { Injectable } from '@angular/core';
import { TransactionModel } from '@models/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly key: string = 't-bank-finance-tracker';

  public set(transactions: TransactionModel[]): void {
    localStorage.setItem(this.key, JSON.stringify(transactions));
  }

  public get(): TransactionModel[] | null {
    const value = localStorage.getItem(this.key);
    if (value) {
      return JSON.parse(value);
    }
    return null;
  }

  public clear(): void {
    localStorage.clear();
  }
}
