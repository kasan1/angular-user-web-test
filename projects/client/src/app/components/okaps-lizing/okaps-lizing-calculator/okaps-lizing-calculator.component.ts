import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ICalculatorResult } from '../../../models/lizing.model';
import {
  setCalculatorCoFinancing,
  setCalculatorPeriod,
} from '../../../store/lizing';
import { IOkapsAppState } from '../../../store/okaps';
import { environment } from '../../../../environments/environment';
import { selectTotalSum } from '../../../store/selectors/lizing.selector';

@Component({
  selector: 'app-okaps-lizing-calculator',
  templateUrl: './okaps-lizing-calculator.component.html',
  styleUrls: ['./okaps-lizing-calculator.component.scss'],
})
export class OkapsLizingCalculatorComponent implements OnInit, OnDestroy {
  @Input() id: string;
  @Input() index: number;
  @Input() isReadOnly: boolean = false;

  ngDestroyed$ = new Subject();

  calculatorResult: ICalculatorResult | null = null;

  coFinancing: number;
  period: number;

  lizingTotalAmount: number;

  constructor(private store: Store<IOkapsAppState>) {}

  ngOnInit(): void {
    this.store
      .select(
        (state: IOkapsAppState) =>
          state.lizing.contractsData[this.id]?.calculatorForm
      )
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((calculator) => {
        if (calculator) {
          this.coFinancing = calculator.coFinancing;
          this.period = calculator.period;
        }
      });

    this.store
      .select(
        (state: IOkapsAppState) =>
          state.lizing.contractsData[this.id]?.calculatorResult
      )
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((calculatorResult) => {
        if (calculatorResult) {
          this.calculatorResult = calculatorResult;
          if (
            calculatorResult !== null &&
            (this.coFinancing === undefined ||
              this.coFinancing < calculatorResult.coFinancing)
          ) {
            this.store.dispatch(
              setCalculatorCoFinancing({
                contractIndex: this.id,
                coFinancing: calculatorResult.coFinancing,
              })
            );
          }

          if (
            calculatorResult !== null &&
            this.period > calculatorResult.period
          ) {
            this.store.dispatch(
              setCalculatorPeriod({
                contractIndex: this.id,
                period: calculatorResult.period,
              })
            );
          }
        }
      });

    selectTotalSum(this.store)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((data) => {
        this.lizingTotalAmount = data;
      });
  }

  ngOnDestroy() {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  get total(): number {
    return (
      this.calculatorResult.sum -
      this.calculatorResult.sum *
        ((this.coFinancing === null
          ? this.calculatorResult.coFinancing
          : this.coFinancing) /
          100)
    );
  }

  get fileServer() {
    return environment.fileServer;
  }

  get paymentUrl() {
    return `${environment.sharedUrl}/paymentschedule/download?period=${this.period}&coFinancing=${this.coFinancing}&rate=${this.calculatorResult.rate}&sum=${this.lizingTotalAmount}`;
  }

  onPeriodChange(event: MatSliderChange) {
    if (this.isReadOnly) return;

    this.store.dispatch(
      setCalculatorPeriod({ contractIndex: this.id, period: event.value })
    );
  }

  onCoFinancingChange(event: MatSliderChange) {
    if (this.isReadOnly) return;

    this.store.dispatch(
      setCalculatorCoFinancing({
        contractIndex: this.id,
        coFinancing: event.value,
      })
    );
  }
}
