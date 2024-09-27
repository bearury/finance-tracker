import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiButtonModule, TuiGroupModule, TuiHintModule } from '@taiga-ui/core';
import { StateService } from '../../services/state.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { AmountTransformPipe } from '../../pipes/amount-transform.pipe';
import { TransactionModel } from '@models/transaction.model';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    AmountTransformPipe,
    CommonModule,
    TuiGroupModule,
    TuiButtonModule,
    TuiHintModule,
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('animation', [
      transition(':enter', [
        style({ opacity: 0, scale: 0.5 }),
        animate('250ms', style({ opacity: 1, scale: 1 })),
      ]),
      transition(':leave', [
        animate('250ms', style({ opacity: 0, scale: 0.5 })),
      ]),
    ]),
  ],
})
export class HistoryComponent implements OnInit {
  protected readonly stateService: StateService = inject(StateService);
  protected readonly localStorageService: LocalStorageService =
    inject(LocalStorageService);

  public ngOnInit(): void {
    const lsData = this.localStorageService.get();
    if (lsData) {
      this.stateService.setTransactions(lsData);
    }
  }

  protected onDelete(id: string): void {
    this.stateService.removeTransaction(id);
    this.localStorageService.set(this.stateService.transactionsState());
  }

  protected onChange(transaction: TransactionModel): void {
    if (this.stateService.currentTransactionsState()?.id === transaction.id) {
      this.stateService.setCurrentUpdatedTransactions(null);
    } else {
      this.stateService.setCurrentUpdatedTransactions(transaction);
    }
  }
}
