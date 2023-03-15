import { ValidatorFn } from '@angular/forms';
import { BooleanFn } from '../models/common.model';

export function conditionalValidator(
  predicate: BooleanFn,
  validator: ValidatorFn,
  errorNamespace?: string
): ValidatorFn {
  return (formControl) => {
    if (!formControl.parent) {
      return null;
    }
    let error = null;
    if (predicate()) {
      error = validator(formControl);
    }
    if (errorNamespace && error) {
      const customError = {};
      customError[errorNamespace] = error;
      error = customError;
    }
    return error;
  };
}
