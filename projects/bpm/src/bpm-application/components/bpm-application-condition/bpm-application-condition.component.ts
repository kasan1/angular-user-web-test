import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { fadeInTrigger } from 'projects/shared/util/triggers';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { IBpmAppState } from 'projects/bpm/src/app/store/bpm';
import {
  selectBpmAppProductId,
  selectBpmApp,
} from '../../store/bpm-application.selectors';
import {
  IDictionaryItem,
  dictionaries,
} from 'projects/shared/services/dictionary.service';
import {
  take,
  map,
  takeUntil,
  takeWhile,
  debounceTime,
  switchMap,
  catchError,
} from 'rxjs/operators';
import { BpmApplicationService } from '../../services/bpm-application.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BpmDictionaryService } from 'projects/bpm/src/app/services/dictionary.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  IBpmApplicationState,
  loadBpmApplicationCondition,
} from '../../store/bpm-application.reducers';
import { BpmPlanService } from '../../services/bpm-plan.service';
import { IPlan } from 'projects/shared/services/plan.service';
import { groupBy } from 'lodash';
import { MatSliderChange } from '@angular/material/slider';
import { HoldingSignal } from '../bpm-holdings/bpm-holdings.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bpm-application-condition',
  templateUrl: './bpm-application-condition.component.html',
  styleUrls: ['./bpm-application-condition.component.scss'],
  animations: [fadeInTrigger],
})
export class BpmApplicationConditionComponent implements OnInit, OnDestroy {
  loanProductCode$: Observable<string>;
  ngDestroyed$ = new Subject();

  plans$ = new BehaviorSubject<{ [key: number]: IPlan }>(null);
  slider$ = new BehaviorSubject<{ min: number; max: number; value: number }>(
    null
  );
  currentPlan$ = new BehaviorSubject<IPlan>(null);

  form: FormGroup;

  constructor(
    private store: Store<IBpmAppState>,
    private plan: BpmPlanService,
    private service: BpmDictionaryService,
    private appService: BpmApplicationService,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._initializeForm();
    this._trackAppCondition();
    this._loadCondition();
    this._loadLoanProductTypes();

    HoldingSignal.signal$
      .pipe(
        takeUntil(this.ngDestroyed$),
        map(() => {
          this.currentPlan$.next(null);
          this._requestPlans();
        })
      )
      .subscribe();
  }

  submit = () => {
    if (
      this.form.get('paymentDay').value < 0 ||
      this.form.get('paymentDay').value > 31
    )
      return this.snackbar.open('Неправильное значение в дате погашения');

    this.appService
      .updateCondition(this.form.value)
      .pipe(take(1))
      .subscribe((x) => {
        if (x)
          this.snackbar.open('Данные успешно сохранены', null, {
            duration: 2500,
          });
      });
  };

  formatLabel = (x: number) => {
    if (x == 0 || !this.plans$.value) return 0;

    const item = this.plans$.value[x];
    if (!item) return 0;

    return item.sum;
  };

  sliderChange = (x: MatSliderChange) => {
    const item = this.plans$.value ? this.plans$.value[x.value] : null;
    this.currentPlan$.next(item);

    this.form.get('amount').setValue(x.value == 0 ? 0 : item ? item.sum : 0);
    this.form
      .get('planId')
      .setValue(x.value == 0 ? null : item ? item.id : null);
  };

  _setSliderValue = (x: IBpmApplicationState) => {
    if (this.slider$.value && this.plans$.value && x.planId) {
      const s = this.slider$.value;
      const p = this.plans$.value;
      let value = 0;

      Object.keys(p).forEach((key) => {
        if (p[+key].id == x.planId) {
          this.currentPlan$.next(p[+key]);
          value = +key;
        }
      });
      this.slider$.next({ ...s, value });
    }
  };

  _loadLoanProductTypes = () =>
    this.service
      .dictionaryItems(dictionaries.dicLoanProduct)
      .pipe(take(1))
      .subscribe((x) => this._trackAppProductId(x));

  _requestPlans = () =>
    this.store
      .pipe(
        take(1),
        select(selectBpmApp),
        switchMap((app) =>
          this.plan.plans(app.id).pipe(
            take(1),
            map((plans) => {
              if (!plans) {
                this.plans$.next(null);
                this.slider$.next(null);
                return;
              }

              const group = groupBy(plans, 'sum');
              const obj = {};

              Object.keys(group).forEach((key, index) => {
                if (!group[key].length) return;

                obj[index + 1] = group[key][0];
              });

              this.plans$.next(obj);
              this.slider$.next({
                min: 0,
                max: Object.keys(group).length,
                value: 0,
              });

              this._setSliderValue(app);
            })
          )
        ),
        catchError(() => {
          this.plans$.next(null);
          this.slider$.next(null);
          return of(null);
        })
      )
      .subscribe();

  // _requestMinMaxPrice = () =>
  // this.store.pipe(select(selectBpmApp), take(1), switchMap(x => ))

  _trackAppProductId = (x: IDictionaryItem[]) => {
    this.loanProductCode$ = this.store.pipe(
      select(selectBpmAppProductId),
      map((id) => {
        const item = x.find((i) => i.id == id);

        if (item && item.code == '1') this._requestPlans();

        return item ? item.code : null;
      })
    );
    this.cdr.detectChanges();
  };

  _trackAppCondition = () =>
    this.store
      .pipe(
        debounceTime(200),
        takeUntil(this.ngDestroyed$),
        select(selectBpmApp),
        map((x) => {
          if (!x.id) return;

          const {
            amount,
            duration,
            transh,
            method,
            periodOd,
            periodPercent,
            paymentPercent,
            paymentDay,
            paymentOd,
            id,
            planId,
          } = x;

          this.form.patchValue({
            amount,
            duration,
            transh,
            method,
            periodOd,
            periodPercent,
            paymentPercent,
            paymentDay,
            paymentOd,
            planId,
            applicationId: id,
          });

          this._setSliderValue(x);
        })
      )
      .subscribe();

  _loadCondition = () =>
    this.store
      .pipe(
        select(selectBpmApp),
        takeWhile((x) => !x.id, true),
        map((x) => {
          if (!x.id) return;

          this.store.dispatch(loadBpmApplicationCondition(x.id));
        })
      )
      .subscribe();

  _initializeForm = () =>
    (this.form = this.fb.group({
      planId: [''],
      amount: [''],
      duration: [''],
      transh: [''],
      method: [''],
      periodOd: [''],
      periodPercent: [''],
      paymentOd: [''],
      paymentPercent: [''],
      paymentDay: [''],

      applicationId: [''],
    }));

  ngOnDestroy() {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }
}
