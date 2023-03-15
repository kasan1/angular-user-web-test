import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  MaritalStatus,
  maritalStatuses,
} from 'projects/shared/models/clientProfile';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { IBpmAppState } from 'projects/bpm/src/app/store/bpm';
import { selectBpmApp } from 'projects/bpm/src/bpm-application/store/bpm-application.selectors';
import { take, map } from 'rxjs/operators';
import { IBpmClient } from 'projects/bpm/src/bpm-application/store/bpm-application.reducers';
import { fadeInTrigger } from 'projects/shared/util/triggers';
import { BpmClientProfileService } from 'projects/bpm/src/app/services/client-profile.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { BpmDictionaryService } from 'projects/bpm/src/app/services/dictionary.service';
import {
  IDictionaryItem,
  dictionaries,
} from 'projects/shared/services/dictionary.service';
import { BpmAsonDialogComponent } from '../bpm-ason-dialog/bpm-ason-dialog.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bpm-client-info-dialog',
  templateUrl: './bpm-client-info-dialog.component.html',
  styleUrls: ['./bpm-client-info-dialog.component.scss'],
  animations: [fadeInTrigger],
})
export class BpmClientInfoDialogComponent implements OnInit {
  profile$: Observable<IBpmClient>;
  loading$ = new Subject<boolean>();
  maritalStatuses = maritalStatuses();

  clientTypes$: Observable<IDictionaryItem[]>;

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private store: Store<IBpmAppState>,
    private service: BpmClientProfileService,
    private snackbar: MatSnackBar,
    private ref: MatDialogRef<BpmClientInfoDialogComponent>,
    private dictionary: BpmDictionaryService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this._initializeForm();

    this.clientTypes$ = this.dictionary
      .dictionaryItems(dictionaries.dicClientType)
      .pipe(take(1));

    this.profile$ = this.store.pipe(
      select(selectBpmApp),
      take(1),
      map((x) => {
        this.form.patchValue({ ...x.client, userId: x.userId });
        return x.client;
      })
    );
  }

  submit = () => {
    if (!this.form.valid) return this.form.markAllAsTouched();

    this.loading$.next(true);
    this.service
      .updateProfile(this.form.value)
      .pipe(take(1))
      .subscribe(
        () => {
          this.loading$.next(false);
          this.snackbar.open('Данные успешно сохранены', null, {
            duration: 2500,
          });
          this.ref.close(this.form.value);
        },
        () => this.loading$.next(false)
      );
  };

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
          this.form.patchValue({ ...x, companyAddress: x.address });
        }
      });

  _initializeForm = () =>
    (this.form = this.fb.group({
      userId: [''],
      documentOrganizationName: ['', Validators.required],
      documentBeginDate: ['', Validators.required],
      documentEndDate: ['', Validators.required],
      documentNumber: ['', Validators.required],
      maritalStatus: [MaritalStatus.Single],
      childrenCount: [0],

      companyRegisterNumber: [''],
      companyRegisterDate: [''],
      companySerialNumber: [''],
      companyNdc: [false],
      companyAddress: [''],
      companyName: [''],
      companyActivity: [''],
      clientTypeId: [null],

      atsId: [0],
      cato: [null],
      geonimId: [0],
      level1: [0],
      level2: [0],
      level3: [0],
      level4: [0],
      level5: [0],
    }));
}
