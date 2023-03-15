import { ValidatorFn, AbstractControl } from '@angular/forms';

export function iinValidator(): ValidatorFn {
  return (control: AbstractControl) => validateIin(control);
}

export function validateIin(
  control: AbstractControl
): { [key: string]: any } | null {
  const { value }: { value: string } = control;

  let valid = value.length > 0;
  if (!valid)
    return {
      invalidIin: true,
      message: '---------',
    };

  valid = /^\d+$/.test(value);
  if (!valid)
    return {
      invalidIin: true,
      message: '-------',
    };

  valid = value.length === 12;
  if (!valid)
    return {
      invalidIin: true,
      message: '-------',
    };
}



export function FilialValidator(): ValidatorFn {
  return (control: AbstractControl) => validateFilial(control);
}

export function validateFilial(
  control: AbstractControl
): { [key: string]: any } | null {
  const { value }: { value: string } = control;

  if (value == undefined)
    return {
      invalidIin: true,
      message: '-------',
    };
  let valid = value.length > 0;
  if (!valid)
    return {
      invalidIin: true,
      message: '-------',
    };


}