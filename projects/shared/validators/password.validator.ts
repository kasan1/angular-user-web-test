import { ValidatorFn, AbstractControl } from '@angular/forms';

export function passwordValidator(count = 8): ValidatorFn {
  return (control: AbstractControl) => validatePassword(control, count);
}

function validatePassword(
  control: AbstractControl,
  count: number
): { [key: string]: any } | null {
  const { value }: { value: string } = control;

  let valid = value.length >= count;
  if (!valid)
    return {
      invalidPassword: true,
      message: `--------------- ${count} -------------`,
    };

  valid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,}$/.test(
    value
  );
  if (!valid)
    return {
      invalidPassword: true,
      message:
        '-------------- (#$^+=!*()@%&)',
    };

  return null;
}
