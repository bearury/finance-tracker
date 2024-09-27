import { Pipe, PipeTransform } from '@angular/core';
import { Types } from '@models/transaction.model';

@Pipe({
  name: 'amountTransform',
  standalone: true,
})
export class AmountTransformPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  transform(amount: number, type: Types): string {
    const operator = type === 'доход' ? '+' : '-';
    const formattedNumber = amount.toLocaleString();
    return `${operator}${formattedNumber}₽`;
  }
}
