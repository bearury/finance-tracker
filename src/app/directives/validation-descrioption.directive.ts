import { Directive, input, OnChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Directive({
  selector: '[appValidationDescription]',
  standalone: true
})

export class ValidationDirective implements OnChanges {
  public readonly appValidation = input.required<boolean>();
  public readonly appControl = input.required<FormControl>();

  public ngOnChanges(): void {
    if (this.appValidation()) {
      this.appControl().setValidators([
        Validators.required,
        Validators.maxLength(100)
      ]);
    } else {
      this.appControl().clearValidators();
    }
    this.appControl().updateValueAndValidity();
  }
}
