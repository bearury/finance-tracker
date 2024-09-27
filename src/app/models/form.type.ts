import { FormControl } from '@angular/forms';

export type FormType = {
  transaction: FormControl;
  category: FormControl;
  amount: FormControl;
  date: FormControl;
  description: FormControl;
};
