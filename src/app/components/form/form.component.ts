import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  TuiAlertService,
  TuiButtonModule,
  TuiDataListModule,
  TuiErrorModule,
  TuiGroupModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiCheckboxLabeledModule,
  TuiDataListWrapperModule,
  TuiFieldErrorPipeModule,
  TuiFilterByInputPipeModule,
  TuiInputDateModule,
  TuiInputNumberModule,
  TuiRadioBlockModule,
  TuiSelectModule,
  TuiStringifyContentPipeModule,
  TuiTextareaModule,
} from '@taiga-ui/kit';
import { Categories, TransactionModel, Types } from '@models/transaction.model';
import { FormType } from '@models/form.type';
import { TuiDay, TuiForModule } from '@taiga-ui/cdk';
import { ValidationDirective } from '../../directives/validation-descrioption.directive';
import { StateService } from '../../services/state.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    ValidationDirective,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TuiGroupModule,
    TuiRadioBlockModule,
    TuiButtonModule,
    TuiSelectModule,
    TuiDataListModule,
    TuiDataListWrapperModule,
    TuiTextfieldControllerModule,
    TuiInputNumberModule,
    TuiFilterByInputPipeModule,
    TuiStringifyContentPipeModule,
    TuiForModule,
    TuiInputDateModule,
    TuiTextareaModule,
    TuiCheckboxLabeledModule,
    TuiFieldErrorPipeModule,
    TuiErrorModule,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('open', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('250ms', style({ height: 'auto', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('250ms', style({ height: 0, opacity: 0 })),
      ]),
    ]),
  ],
})
export class FormComponent {
  protected readonly transactions: Types[] = ['доход', 'расход'];
  protected readonly expenseCategories: Categories[] = [
    'Коммунальные услуги',
    'Продукты',
    'Путешествия',
  ];
  protected readonly incomeCategories: Categories[] = [
    'Заработная плата',
    'Инвестиции',
    'Фриланс',
  ];
  protected readonly selectedCategories = signal<Categories[]>([]);
  protected readonly currentDate = signal(TuiDay.currentLocal());
  protected readonly isSubmitted = signal<boolean>(false);
  protected readonly isDescription = signal<boolean>(false);
  protected readonly form: FormGroup<FormType> = new FormGroup({
    transaction: new FormControl<Types | null>(null, [Validators.required]),
    category: new FormControl<Categories | null>(null, [Validators.required]),
    amount: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(10000000),
    ]),
    date: new FormControl<string | null>(null, [Validators.required]),
    description: new FormControl<string | null>(null),
  });
  protected readonly controlCheckedDescription = new FormControl<boolean>(
    false
  );
  protected readonly stateService: StateService = inject(StateService);
  protected readonly buttonName = computed(() =>
    this.stateService.currentTransactionsState() ? 'Изменить' : 'Добавить'
  );
  protected readonly notificationMessage = computed(() =>
    this.stateService.currentTransactionsState()
      ? 'Транзакция изменена!'
      : 'Транзакция добавлена!'
  );
  private readonly alerts = inject(TuiAlertService);
  private readonly localStorageService = inject(LocalStorageService);

  constructor() {
    effect(() => {
      const tr = this.stateService.currentTransactionsState();
      if (tr) {
        const { type, amount, category, date, description } = tr;
        const year = date.split('.')[2];
        const month = date.split('.')[1];
        const day = date.split('.')[0];

        this.form.patchValue({
          amount,
          transaction: type,
          date: new TuiDay(+year, +month - 1, +day),
          category,
          description,
        });

        this.controlCheckedDescription.setValue(!!description);
      } else {
        this.form.reset();
        this.controlCheckedDescription.setValue(false);
      }
    });

    this.form.controls.transaction.valueChanges.subscribe((value) => {
      this.selectedCategories.set(
        value === 'доход' ? this.incomeCategories : this.expenseCategories
      );
      this.form.controls.category.reset();
    });

    this.controlCheckedDescription.valueChanges.subscribe((value) => {
      this.isDescription.set(value === null ? false : value);
    });
  }

  protected onSubmit(): void {
    this.isSubmitted.set(true);

    if (this.form.valid) {
      this.showNotification({
        type: this.form.controls.transaction.value,
        category: this.form.controls.category.value,
      });
      const values = this.form.value;
      const day =
        values.date.day < 10 ? `0${values.date.day}` : `${values.date.day}`;
      const month =
        values.date.month < 10
          ? `0${values.date.month + 1}`
          : `${values.date.month + 1}`;

      const date = `${day}.${month}.${values.date.year}`;

      const description =
        values.description && this.controlCheckedDescription.value
          ? values.description
          : null;
      const id =
        this.stateService.currentTransactionsState()?.id ?? crypto.randomUUID();

      const newTransactions = new TransactionModel(
        id,
        values.transaction,
        values.category,
        values.amount,
        date,
        description
      );

      if (this.stateService.currentTransactionsState()) {
        this.stateService.updateTransaction(newTransactions);
      } else {
        this.stateService.addTransaction(newTransactions);
      }

      this.localStorageService.set(this.stateService.transactionsState());

      this.form.reset();
      this.isSubmitted.set(false);
      this.isDescription.set(false);
      this.controlCheckedDescription.setValue(false);
      this.stateService.setCurrentUpdatedTransactions(null);
    }
  }

  protected hasErrors(control: FormControl, errorName: string): boolean {
    return this.isSubmitted() && control.hasError(errorName);
  }

  protected showNotification({
    category,
    type,
  }: {
    category: Categories;
    type: Types;
  }): void {
    const message = this.notificationMessage();
    this.alerts
      .open(`В категорию <strong>${category}</strong>`, {
        label: message,
        status: type === 'доход' ? 'success' : 'info',
        autoClose: 3000,
      })
      .subscribe();
  }
}
