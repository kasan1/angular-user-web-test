import {
  Directive,
  ElementRef,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CurrencyPipe } from '../pipes/currency.pipe';

@Directive({
  selector: '[currencyInput]',
})
export class CurrencyInputDirective implements OnInit, OnChanges {
  @Input('currencyInput') currentValue: any;

  constructor(private element: ElementRef, private currency: CurrencyPipe) {}

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.currentValue.firstChange)
      this._initializeValue(this.element.nativeElement as HTMLInputElement);
  }

  ngOnInit() {
    const element = this.element.nativeElement as HTMLInputElement;
    if (!element) return;

    element.addEventListener('blur', this._toggleType);
    element.addEventListener('focus', this._toggleType);

    this._initializeValue(element);
  }

  _initializeValue = (element: HTMLInputElement) => {
    if (!element) return;

    element.value =
      element.type == 'text'
        ? this.currency.transform(element.value, false, true)
        : this.currentValue;
  };

  _toggleType = (event: FocusEvent) => {
    const element = event.target as HTMLInputElement;
    if (element.readOnly) return;

    element.type = event.type == 'blur' ? 'text' : 'number';

    element.value =
      element.type == 'text'
        ? this.currency.transform(element.value, false, true)
        : this.currentValue;
  };
}
