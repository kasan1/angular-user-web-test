import {
  IFileInfo,
  FilePage,
  TESTPledgeCodes,
} from 'projects/shared/models/fileInfo';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Inject,
  OnDestroy,
} from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { BehaviorSubject, Subject, of, Observable } from 'rxjs';
import { fadeInTrigger, fadeInOutTrigger } from 'projects/shared/util/triggers';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
import { BpmPledgeService } from '../../services/bpm-pledge.service';
import {
  take,
  switchMap,
  map,
  catchError,
  tap,
  debounceTime,
  takeUntil,
} from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BpmFileService } from 'projects/bpm/src/app/services/bpm-file.service';
import { BpmApplicationFileDialogComponent } from '../bpm-application-file-dialog/bpm-application-file-dialog.component';
import {
  IDictionaryItem,
  dictionaries,
} from 'projects/shared/services/dictionary.service';
import { BpmDictionaryService } from 'projects/bpm/src/app/services/dictionary.service';
import { BpmAsonDialogComponent } from 'projects/bpm/src/bpm-shared/components/bpm-ason-dialog/bpm-ason-dialog.component';
import { BpmAsonService } from 'projects/bpm/src/app/services/ason.service';
import { INameIdPair } from 'projects/shared/services/ason.service';
import { IBpmAppState } from 'projects/bpm/src/app/store/bpm';
import { select, Store } from '@ngrx/store';
import { selectBpmApp } from '../../store/bpm-application.selectors';
import {
  PledgeFirstLevel,
  PledgeSecondLevel,
} from 'projects/shared/services/pledge.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bpm-holding-dialog',
  templateUrl: './bpm-holding-dialog.component.html',
  styleUrls: ['./bpm-holding-dialog.component.scss'],
  animations: [fadeInTrigger, fadeInOutTrigger],
})
export class BpmHoldingDialogComponent implements OnInit, OnDestroy {
  wallMaterials$: Observable<INameIdPair[]>;
  noks$: Observable<IDictionaryItem[]>;

  firstLevel$ = new BehaviorSubject<string>('1');
  secondLevel$ = new BehaviorSubject<string>('1');
  thirdLevel$ = new BehaviorSubject<string>('1');

  rent$ = new BehaviorSubject<number>(null);
  landPurposes$ = new BehaviorSubject<IDictionaryItem[]>(null);
  transportTypes$ = new BehaviorSubject<IDictionaryItem[]>(null);
  guaranteeTypes$ = new BehaviorSubject<IDictionaryItem[]>(null);

  displayAddress$ = new BehaviorSubject(false);
  displayExpertSum$ = new BehaviorSubject(false);

  loading$ = new BehaviorSubject(false);
  cato$ = new BehaviorSubject<string>("");
  asonLoading$ = new Subject<boolean>();
  saving$ = new Subject<boolean>();

  files$ = new BehaviorSubject<IFileInfo[]>([]);
  ngDestroyed$ = new Subject();

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private ason: BpmAsonService,
    private file: BpmFileService,
    private cdr: ChangeDetectorRef,
    private snackbar: MatSnackBar,
    private service: BpmPledgeService,
    private store: Store<IBpmAppState>,
    private dictionary: BpmDictionaryService,
    private ref: MatDialogRef<BpmHoldingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { applicationId: string; id: string }
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this._initializeForm(this.data.applicationId);
      this._trackNok();

      if (this.data.id) {
        this.loading$.next(true);

        this._loadFiles();

        this.service.pledge(this.data.id).subscribe(
          (x) => {
            this.form.patchValue(x);

            if (
              x.firstLevel == PledgeFirstLevel.Nonmovable &&
              (x.secondLevel == PledgeSecondLevel.Living ||
                x.secondLevel == PledgeSecondLevel.Commercial)
            )
              this._loadWallMaterials();

            if (
              x.firstLevel == PledgeFirstLevel.Nonmovable ||
              (x.firstLevel == PledgeFirstLevel.Movable &&
                x.secondLevel != PledgeSecondLevel.Money)
            )
              this._loadNokList();

            if (x.address) this.displayAddress$.next(true);
            if (x.expertSum) this.displayExpertSum$.next(true);

            if (x.cato) {
              this.cato$ = new BehaviorSubject<string>(x.cato);
            }

            x.chargees.forEach((c) => {
              const item = this._chargeeItem();
              item.patchValue(c);
              this.chargees().push(item);
            });

            x.liters.forEach((l) => {
              const item = this._literItem();
              item.patchValue(l);
              this.liters().push(item);
            });

            this.loading$.next(false);

            this._changeFirstLevel(`${x.firstLevel}`);
            this._changeSecondLevel(`${x.secondLevel}`, x.rent);
            this._changeThirdLevel(`${x.thirdLevel}`);
          },
          () => this.loading$.next(false)
        );
      } else {
        this._loadNokList();
        this._loadWallMaterials();
      }
    }
  }

  _changeFirstLevel = (value: string) => {
    this.form.get('firstLevel').setValue(value);
    this._nullifySums();

    this.firstLevel$.next(value);

    if (value == '2' && !this.transportTypes$.value) this._loadTransportTypes();
    if (value == '3' && !this.guaranteeTypes$.value) this._loadGuaranteeTypes();
  };

  _changeSecondLevel = (value: string, rent?: number) => {
    this.form.get('secondLevel').setValue(value);
    this._nullifySums();

    this.secondLevel$.next(value);

    if (this.firstLevel$.value == '1' && value == '3') {
      this.rent$.next(rent || 1);
      if (!this.landPurposes$.value) this._loadLandPurposes();
    } else this.rent$.next(null);
  };

  _changeThirdLevel = (value: string) => {
    this.form.get('thirdLevel').setValue(value);
    this._nullifySums();

    this.thirdLevel$.next(value);
  };

  _nullifySums = () => {
    if (this.data.id) return;

    this.form.get('expertSum').setValue(null);
    this.form.get('asonSum').setValue(null);
    this.form.get('nokSum').setValue(null);
  };

  firstLevelChange = (e: MatButtonToggleChange) => {
    this._changeFirstLevel(e.value);
    this.cdr.detectChanges();
  };

  secondLevelChange = (e: MatButtonToggleChange) => {
    this._changeSecondLevel(e.value);
    this.cdr.detectChanges();
  };

  thirdLevelChange = (e: MatButtonToggleChange) => {
    this._changeThirdLevel(e.value);
    this.cdr.detectChanges();
  };

  requestAsonSum = () => {
    if (!this.displayAddress$.value)
      return this.snackbar.open(
        'Необходимо выбрать Адрес местонахождения',
        null,
        { duration: 5000 }
      );

    if (!this.form.get('wallMaterial').value) {
      this.highlightField('wallMaterial');
      return this.snackbar.open('Необходимо указать Материал стен', null, {
        duration: 5000,
      });
    }

    let realtyType = 0;

    if (this.secondLevel$.value == '2') realtyType = 3;
    else if (this.secondLevel$.value == '1' && this.thirdLevel$.value == '1')
      realtyType = 2;
    else if (this.secondLevel$.value == '1' && this.thirdLevel$.value == '2')
      realtyType = 1;

    this.asonLoading$.next(true);
    this.asonSum().setValue(0);

    this.ason
      .propertyPrice({
        atsId: this.form.get('atsId').value,
        geonimId: this.form.get('geonimId').value,
        houseNumber: this.form.get('houseNumber').value || 0,
        roomNumber: this.form.get('roomNumber').value || 0,
        yearBuilt: this.form.get('builtYear').value || 0,
        totalSquare:
          (this.secondLevel$.value != '3'
            ? this.form.get('totalArea').value
            : this.form.get('landArea').value) || 0,
        realtyType,
        wallMaterial: this.form.get('wallMaterial').value,
      })
      .pipe(
        take(1),
        map((x) => {
          this.asonLoading$.next(false);
          if (!x || !x.totalSum) {
            this.snackbar.open(
              'Стоимость АСОН не найдена, введите Экспертную',
              null,
              { duration: 5000 }
            );
            this.highlightField('expertSum');
            this.displayExpertSum$.next(true);
            return;
          }

          this.asonSum().setValue(x.totalSum);
        }),
        catchError(() => {
          this.asonLoading$.next(false);
          this.displayExpertSum$.next(true);
          this.snackbar.open('Не удалось вычислить сумму АСОН');
          return of(null);
        })
      )
      .subscribe();
  };

  expertSum = () => this.form.get('expertSum');
  asonSum = () => this.form.get('asonSum');
  nokSum = () => this.form.get('nokSum');

  submit = () => {
    if (!this.form.valid) return this.form.markAllAsTouched();

    this.saving$.next(true);

    if (
      this.firstLevel$.value != '1' ||
      this.secondLevel$.value != '1' ||
      this.thirdLevel$.value != '1'
    ) {
      this.liters().clear();
      this.hasLiters().setValue(false);
    }

    this.form.patchValue({ "cato": this.cato$.getValue() });

    if (this.data.id) {
      this.service
        .updatePledge({ ...this.form.value, id: this.data.id })
        .pipe(take(1))
        .subscribe(this._successResponse, () => this.saving$.next(false));
    } else
      this.service
        .addPledge(this.form.value)
        .pipe(
          take(1),
          switchMap((x) => this._uploadFiles(x))
        )
        .subscribe(this._successResponse, () => this.saving$.next(false));
  };

  chargees = () => this.form.get('chargees') as FormArray;
  liters = () => this.form.get('liters') as FormArray;
  hasLiters = () => this.form.get('hasLiters');

  addChargee = () => this.chargees().push(this._chargeeItem());
  addLiter = () => this.liters().push(this._literItem());

  removeChargee = (i: number) => this.chargees().removeAt(i);
  removeLiter = (i: number) => this.liters().removeAt(i);

  documentDialog = () =>
    this.dialog
      .open(BpmApplicationFileDialogComponent, {
        panelClass: ['d-lg'],
        hasBackdrop: true,
        disableClose: true,
        autoFocus: true,
        data: {
          appId: this.data.applicationId,
          basePledgeId: this.data.id,
          page: FilePage.AppPledges,
          codes: TESTPledgeCodes(),
          skipSave: this.data.id ? false : true,
        },
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((x: IFileInfo[]) => {
        if (x && x.length && !this.data.id)
          this.files$.next([...this.files$.value, ...x]);
        else if (x) this._loadFiles();
      });

  fileChange = (event: IFileInfo[]) => {
    this.files$.next(event);
  };

  rentChange = (event: MatButtonToggleChange) => {
    this.form.get('rent').setValue(event.value);
    this.rent$.next(event.value);
  };

  currentYear = () => new Date().getFullYear();

  asonDialog = () =>
    this.dialog
      .open(BpmAsonDialogComponent, {
        panelClass: ['d-lg', 'lg-md'],
        hasBackdrop: true,
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((x) => {
        if (x && x.address) {
          this.displayAddress$.next(true);
          this.form.patchValue(x);
        }
      });

  highlightField = (name: string) => {
    const field = this.form.get(name);
    if (!field || field.validator) return;

    field.setValidators(Validators.required);
    field.updateValueAndValidity({ emitEvent: false });
    field.markAsTouched();

    setTimeout(() => {
      field.clearValidators();
      field.updateValueAndValidity({ emitEvent: false });
      field.markAsUntouched();
    }, 5000);
  };

  _uploadFiles = (basePledgeId: string) =>
    this.files$.value.length
      ? this.file
        .upload(
          this.files$.value
            .filter((x) => !x.id)
            .map((f) => ({ ...f, basePledgeId }))
        )
        .pipe(
          take(1),
          map(() => basePledgeId),
          catchError(() =>
            of(null).pipe(
              tap(() => {
                this.snackbar.open('Не удалось загрузить файлы');
              })
            )
          )
        )
      : of(basePledgeId);

  _loadFiles = () =>
    this.file
      .load({
        appId: this.data.applicationId,
        basePledgeId: this.data.id,
        page: FilePage.AppPledges,
      })
      .pipe(take(1))
      .subscribe((x) => this.files$.next(x));

  _initializeForm = (applicationId: string) => {
    this.form = this.fb.group({
      applicationId: [applicationId],
      firstLevel: ['1'],
      secondLevel: ['1'],
      thirdLevel: ['1'],

      expertSum: [''],
      asonSum: [''],
      nokSum: [''],
      nokName: [''],
      dicNokId: [null],

      cadastralNumber: [''],

      address: [''],
      atsId: [0],
      cato: [null],
      geonimId: [0],
      level1: [0],
      level2: [0],
      level3: [0],
      level4: [0],
      level5: [0],
      houseNumber: [''],
      roomNumber: [''],
      wallMaterial: [''],

      totalArea: [''],
      livingArea: [''],
      builtYear: [''],
      landArea: [''],

      landPurpose: [0],
      rent: [''],
      rentedFor: [''],
      agreement: [false],

      name: ['', Validators.maxLength(200)],
      year: [''],
      govNumber: ['', Validators.maxLength(100)],
      registerNumber: ['', Validators.maxLength(100)],
      registerDate: [''],
      vin: ['', Validators.maxLength(100)],
      mark: ['', Validators.maxLength(400)],
      color: ['', Validators.maxLength(50)],
      company: ['', Validators.maxLength(200)],
      countryCode: ['', Validators.maxLength(50)],
      transportCode: ['', Validators.maxLength(50)],
      bvu: ['', Validators.maxLength(100)],
      commercialName: ['', Validators.maxLength(200)],
      depositDate: [''],
      depositTotal: [''],
      depositNumber: ['', Validators.maxLength(200)],

      guaranteeCode: [0, Validators.max(50)],
      date: [''],
      validFor: [''],

      chargees: this.fb.array([]),

      hasLiters: [false],
      liters: this.fb.array([]),
    });
  };

  _chargeeItem = () =>
    this.fb.group({
      id: [null],
      iin: ['', Validators.required],
      fullName: ['', [Validators.required, Validators.maxLength(200)]],
      samePerson: [false],

      documentNumber: ['', Validators.maxLength(50)],
      documentBeginDate: [''],
      documentEndDate: [''],
      documentOrganizationName: ['', Validators.maxLength(200)],
    });

  _literItem = () =>
    this.fb.group({
      id: [null],
      value: ['', Validators.maxLength(100)],
      name: ['', Validators.maxLength(200)],
      area: [''],
    });

  _successResponse = (x: string) => {
    if (!x) return;

    this.snackbar.open('Данные успешно сохранены', null, {
      duration: 2500,
    });
    this.saving$.next(false);
    this.ref.close(x);
  };

  _loadLandPurposes = () =>
    this.dictionary
      .dictionaryItems(dictionaries.dicLandPurpose)
      .pipe(take(1))
      .subscribe((x) => {
        this.landPurposes$.next(x);
      });

  _loadTransportTypes = () =>
    this.dictionary
      .dictionaryItems(dictionaries.dicTransportType)
      .pipe(take(1))
      .subscribe((x) => {
        this.transportTypes$.next(x);
      });

  _loadGuaranteeTypes = () =>
    this.dictionary
      .dictionaryItems(dictionaries.dicGuaranteeType)
      .pipe(take(1))
      .subscribe((x) => {
        this.guaranteeTypes$.next(x);
      });

  _trackNok = () => {
    this.form
      .get('nokName')
      .valueChanges.pipe(
        takeUntil(this.ngDestroyed$),
        debounceTime(200),
        map((x) => {
          if (!x) return;

          this.form.get('dicNokId').setValue(null, { emitEvent: false });
          this.form.get('agreement').setValue(false);
        })
      )
      .subscribe();

    this.form
      .get('dicNokId')
      .valueChanges.pipe(
        takeUntil(this.ngDestroyed$),
        debounceTime(200),
        map((x) => {
          if (!x) return this.form.get('agreement').setValue(false);

          this.form.get('nokName').setValue('', { emitEvent: false });
          return this.form.get('agreement').setValue(true);
        })
      )
      .subscribe();
  };

  _loadWallMaterials = () =>
    (this.wallMaterials$ = this.ason.wallMaterials().pipe(take(1)));

  _loadNokList = () =>
    (this.noks$ = this.store.pipe(
      select(selectBpmApp),
      take(1),
      switchMap((x) => this.service.nokList(x.id).pipe(take(1)))
    ));

  _setKatoCodeResult = (code: string) => {
    this.cato$.next(code);
  }


  ngOnDestroy() {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }
}
