import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatCurrency',
})
export class CurrencyPipe implements PipeTransform {
  transform(
    value: string | number,
    ignoreFloat?: boolean,
    ignoreDefault?: boolean
  ): string {
    return formatCurrency(value, ignoreFloat, ignoreDefault);
  }
}

export const formatCurrency = (
  value: string | number,
  ignoreFloat?: boolean,
  ignoreDefault?: boolean
) => {
  if (!value && !ignoreDefault) return '0.00';
  else if (!value) return '';

  value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  if (!ignoreFloat) {
    const index = value.indexOf('.');
    if (index == -1) value += '.00';
    else if (index == value.length - 1) value += '00';
    else {
      const afterDecimal = value.substring(index + 1);
      value =
        afterDecimal.length == 1
          ? value + '0'
          : value.replace(
              `.${afterDecimal}`,
              `.${afterDecimal.replace(' ', '').substr(0, 2)}`
            );
    }
  }

  return value;
};
