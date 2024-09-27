import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../services/state.service';
import { Categories } from '@models/transaction.model';
import { TuiRingChartModule } from '@taiga-ui/addon-charts';
import { tuiSum } from '@taiga-ui/cdk';

@Component({
  selector: 'app-statistic',
  standalone: true,
  imports: [CommonModule, TuiRingChartModule],
  templateUrl: './statistic.component.html',
  styleUrl: './statistic.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticComponent {
  protected incomingIndex = NaN;
  protected expensingIndex = NaN;
  private readonly stateService: StateService = inject(StateService);
  protected readonly amountForCategory = computed(() => {
    const incomingSums: { [key: string]: number } = {};
    const expensingSums: { [key: string]: number } = {};
    this.stateService.transactionsState().forEach((transaction) => {
      if (transaction.type === 'доход') {
        if (!incomingSums[transaction.category]) {
          incomingSums[transaction.category] = 0;
        }
        incomingSums[transaction.category] += transaction.amount;
      } else {
        if (!expensingSums[transaction.category]) {
          expensingSums[transaction.category] = 0;
        }
        expensingSums[transaction.category] += transaction.amount;
      }
    });
    return {
      incoming: Object.values(incomingSums),
      expensing: Object.values(expensingSums),
    };
  });
  private readonly categories = computed(() => {
    const incomingCategories = new Set<Categories>();
    const expensingCategories = new Set<Categories>();
    this.stateService.transactionsState().forEach((transaction) => {
      if (transaction.type === 'доход') {
        incomingCategories.add(transaction.category);
      } else {
        expensingCategories.add(transaction.category);
      }
    });
    return {
      incoming: Array.from(incomingCategories),
      expensing: Array.from(expensingCategories),
    };

    // const result = this.stateService.transactionsState().reduce(
    //   (acc, transaction) => {
    //     if (transaction.type === 'доход') {
    //       acc.incoming.add(transaction.category);
    //     } else {
    //       acc.expensing.add(transaction.category);
    //     }
    //     return acc;
    //   },
    //   {
    //     incoming: new Set<Categories>(),
    //     expensing: new Set<Categories>(),
    //   }
    // );
    // return {
    //   incoming: Array.from(result.incoming),
    //   expensing: Array.from(result.expensing),
    // };
  });
  private readonly incomingTotal = computed(() =>
    tuiSum(...this.amountForCategory().incoming)
  );
  private readonly expensingTotal = computed(() =>
    tuiSum(...this.amountForCategory().expensing)
  );

  protected get incomingSum(): number {
    return (
      (Number.isNaN(this.incomingIndex)
        ? this.incomingTotal()
        : this.amountForCategory().incoming[this.incomingIndex]) ?? 0
    );
  }

  protected get expensingSum(): number {
    return (
      (Number.isNaN(this.expensingIndex)
        ? this.expensingTotal()
        : this.amountForCategory().expensing[this.expensingIndex]) ?? 0
    );
  }

  protected get incomingLabel(): string {
    return (
      (Number.isNaN(this.incomingIndex)
        ? 'Итого'
        : this.categories().incoming[this.incomingIndex]) ?? ''
    );
  }

  protected get expensingLabel(): string {
    return (
      (Number.isNaN(this.expensingIndex)
        ? 'Итого'
        : this.categories().expensing[this.expensingIndex]) ?? ''
    );
  }
}
