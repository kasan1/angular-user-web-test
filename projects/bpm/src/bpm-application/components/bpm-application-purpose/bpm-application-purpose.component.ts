import { selectBpmApp } from './../../store/bpm-application.selectors';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { Observable, Subject, of, Subscription } from 'rxjs';
import {
  IDictionaryItem,
  dictionaries,
} from 'projects/shared/services/dictionary.service';
import { BpmDictionaryService } from 'projects/bpm/src/app/services/dictionary.service';
import {
  take,
  map,
  switchMap,
  repeatWhen,
  catchError,
  tap,
  debounceTime,
  takeWhile,
} from 'rxjs/operators';
import { fadeInTrigger } from 'projects/shared/util/triggers';
import { Store, select } from '@ngrx/store';
import { IBpmAppState } from 'projects/bpm/src/app/store/bpm';
import { BpmFileService } from 'projects/bpm/src/app/services/bpm-file.service';
import {
  FilePage,
  IFileInfo,
  TESTPurposeCodes,
} from 'projects/shared/models/fileInfo';
import { MatDialog } from '@angular/material/dialog';
import { BpmApplicationFileDialogComponent } from '../bpm-application-file-dialog/bpm-application-file-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BpmProductDialogComponent } from '../bpm-product-dialog/bpm-product-dialog.component';
import { ConfirmationDialogComponent } from 'projects/shared/components/confirmation-dialog/confirmation-dialog.component';
import { BpmApplicationService } from '../../services/bpm-application.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  setBpmAppProductId,
  updateBpmApplicationPurposeFields,
} from '../../store/bpm-application.reducers';
import { HoldingSignal } from '../bpm-holdings/bpm-holdings.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bpm-application-purpose',
  templateUrl: './bpm-application-purpose.component.html',
  styleUrls: ['./bpm-application-purpose.component.scss'],
  animations: [fadeInTrigger],
})
export class BpmApplicationPurposeComponent implements OnInit, OnDestroy {
  loanProduct$: Observable<IDictionaryItem>;
  activities$: Observable<IDictionaryItem[]>;
  loanPurposes$: Observable<IDictionaryItem[]>;
  files$: Observable<IFileInfo[]>;

  loading$ = new Subject<boolean>();
  repeat$ = new Subject();

  appId: string;
  form: FormGroup;
  loanProducts: IDictionaryItem[] = [];

  activitiesCache: IDictionaryItem[] = [];
  loanPurposeCache: IDictionaryItem[] = [];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private file: BpmFileService,
    private snackbar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private store: Store<IBpmAppState>,
    private service: BpmDictionaryService,
    private appService: BpmApplicationService
  ) {}

  ngOnInit(): void {
    this._initializeForm();

    this.loading$.next(true);
    this.loanProduct$ = this.service
      .dictionaryItems(dictionaries.dicLoanProduct)
      .pipe(
        take(1),
        switchMap((x) =>
          of(null).pipe(
            repeatWhen(() => this.repeat$),
            switchMap(() =>
              this.store.pipe(
                select(selectBpmApp),
                takeWhile((x) => !x.id, true),
                map((app) => {
                  if (!app.id) return;

                  this.loanProducts = x;

                  const product = x.find(
                    (item) => item.id == app.loanProductId
                  );
                  if (product) {
                    this._initializeForm(product.code);
                    this._trackValidation(product.code);
                    this.form.patchValue(app);

                    this.productDialog = this._initializeProductDialog(
                      x,
                      product.code
                    );

                    if (product.code == '1') this._loadActivities();

                    if (product.code != '1') this._loadFiles(app.id);

                    if (product.code == '3' || product.code == '4')
                      this._loadLoanPurposes();
                  }

                  this.appId = app.id;

                  this.loading$.next(false);
                  return product;
                })
              )
            )
          )
        ),
        catchError(() => {
          this.loading$.next(false);
          return of(null);
        })
      );
  }

  productDialog = () => {};

  documentDialog = () =>
    this.dialog
      .open(BpmApplicationFileDialogComponent, {
        panelClass: ['d-lg'],
        disableClose: true,
        hasBackdrop: true,
        autoFocus: true,
        data: {
          appId: this.appId,
          page: FilePage.AppPurpose,
          codes: TESTPurposeCodes(),
        },
      })
      .afterClosed()
      .pipe(
        take(1),
        map((x) => {
          if (x) this._loadFiles(this.appId);
        })
      )
      .subscribe();

  submit = (p: IDictionaryItem) => {
    if (this.form.invalid) return this.form.markAllAsTouched();

    const loanPurposeCode = this.loanPurposeCode().value;
    if (loanPurposeCode) {
      const loanPurpose = this.loanPurposeCache.find(
        (x) => x.code == loanPurposeCode
      );
      this.loanPurposeId().setValue(loanPurpose ? loanPurpose.id : null);
    }

    this.loading$.next(true);
    this.appService
      .updateApplicationPurposeFields({
        ...this.form.value,
        applicationId: this.appId,
      })
      .pipe(take(1))
      .subscribe(
        (x) => {
          if (x) {
            this.snackbar.open('Данные успешно сохранены', null, {
              duration: 3000,
            });

            if (this.form.get('activityTypeId').value)
              HoldingSignal.signal$.next();

            this.store.dispatch(
              updateBpmApplicationPurposeFields({
                ...this.form.value,
                purpose: p.nameRu,
              })
            );
          }
        },
        () => this.loading$.next(false),
        () => this.loading$.next(false)
      );
  };

  loanPurposeId = () => this.form.get('loanPurposeId');
  annualPayment = () => this.form.get('annualPayment');
  loanPurposeCode = () => this.form.get('loanPurposeCode');
  activityTypeId = () => this.form.get('activityTypeId');
  purposeDescription = () => this.form.get('purposeDescription');
  withFood = () => this.form.get('withFood');

  _loadActivities = () => {
    this.activities$ = !this.activitiesCache.length
      ? this.service.dictionaryItems(dictionaries.dicActivityType).pipe(
          take(1),
          map((x) => {
            this._presetActivity(x);

            this.activitiesCache = x.filter((item) => item.code != '5');
            return this.activitiesCache;
          })
        )
      : of(this.activitiesCache).pipe(
          map((x) => {
            this._presetActivity(x);
            return x;
          })
        );

    this.cdr.detectChanges();
  };

  _presetActivity = (x: IDictionaryItem[]) => {
    if (this.withFood().value === null) this.withFood().setValue(true);
  };

  _loadLoanPurposes = () => {
    this.loanPurposes$ = !this.loanPurposeCache.length
      ? this.service.dictionaryItems(dictionaries.dicLoanPurpose).pipe(
          take(1),
          map((x) => {
            this._presetLoanPurpose(x);

            this.loanPurposeCache = x;
            return this.loanPurposeCache;
          })
        )
      : of(this.loanPurposeCache).pipe(
          map((x) => {
            this._presetLoanPurpose(x);
            return x;
          })
        );

    this.cdr.detectChanges();
  };

  _presetLoanPurpose = (x: IDictionaryItem[]) => {
    if (!this.loanPurposeId().value) {
      this.loanPurposeId().setValue(x && x.length ? x[0].id : null);
      this.loanPurposeCode().setValue(x && x.length ? x[0].code : null);
    } else {
      const item = x.find((i) => i.id == this.loanPurposeId().value);
      if (item) this.loanPurposeCode().setValue(item.code);
    }
  };

  _loadFiles = (appId: string) => {
    this.files$ = this.file
      .load({
        appId,
        page: FilePage.AppPurpose,
      })
      .pipe(take(1));

    this.cdr.detectChanges();
  };

  _initializeForm = (productCode?: string) =>
    (this.form = this.fb.group({
      projectDescription: ['', Validators.required],
      purposeDescription: ['', productCode == '2' ? [Validators.required] : []],
      annualPayment: [''],
      withFood: [true],
      activityTypeId: [''],
      loanPurposeId: [''],
      loanPurposeCode: [''],
    }));

  _initializeProductDialog = (
    products: IDictionaryItem[],
    current: string
  ) => () => {
    this.loading$.next(true);

    this.dialog
      .open(BpmProductDialogComponent, {
        panelClass: ['d-lg', 'md-md', 'xl-sm'],
        hasBackdrop: true,
        data: {
          products,
          current,
        },
      })
      .afterClosed()
      .pipe(
        take(1),
        switchMap((x) => {
          if (x) {
            if (x == current) {
              this.loading$.next(false);
              return of(null);
            }

            const currentProduct = products.find((p) => p.code == current);
            const selectedProduct = products.find((p) => p.code == x);

            const append =
              currentProduct && selectedProduct
                ? ` с ${currentProduct.nameRu} на ${selectedProduct.nameRu}?`
                : '?';

            return this.dialog
              .open(ConfirmationDialogComponent, {
                panelClass: ['d-lg', 'lg-md'],
                hasBackdrop: true,
                data: {
                  title: 'Подтверждение',
                  text: `Вы уверены что хотите сменить тип продукта${append}`,
                },
              })
              .afterClosed()
              .pipe(
                take(1),
                switchMap((r) => {
                  if (r)
                    return this.appService
                      .updateProductCode({
                        applicationId: this.appId,
                        loanProductCode: x,
                      })
                      .pipe(
                        map((result) => {
                          if (result) {
                            this.store.dispatch(
                              setBpmAppProductId(selectedProduct)
                            );
                            this.store.dispatch(
                              updateBpmApplicationPurposeFields({
                                withFood: true,
                                purpose: selectedProduct.nameRu,
                              })
                            );
                            this.snackbar.open(
                              'Тип продукта успешно сменен',
                              null,
                              { duration: 3000 }
                            );

                            this.loading$.next(false);
                            this.repeat$.next();
                          }
                        }),
                        catchError(() =>
                          of(null).pipe(tap(() => this.loading$.next(false)))
                        )
                      );

                  this.loading$.next(false);
                  return of(null);
                })
              );
          }

          this.loading$.next(false);
          return of(null);
        })
      )
      .subscribe();
  };

  _trackValidation = (productCode: string) => {
    if (productCode == '3' || productCode == '4') {
      if (this.loanPurposeCodeSub) this.loanPurposeCodeSub.unsubscribe();

      this.loanPurposeCodeSub = this.loanPurposeCode()
        .valueChanges.pipe(
          debounceTime(200),
          map((x: string) => {
            if (x == '2') {
              this.purposeDescription().setValidators(Validators.required);
              this.purposeDescription().updateValueAndValidity();
            } else {
              this.purposeDescription().clearValidators();
              this.purposeDescription().updateValueAndValidity();
            }
          })
        )
        .subscribe();
    }
  };

  loanPurposeCodeSub: Subscription;
  ngOnDestroy() {
    if (this.loanPurposeCodeSub) this.loanPurposeCodeSub.unsubscribe();
  }
}
