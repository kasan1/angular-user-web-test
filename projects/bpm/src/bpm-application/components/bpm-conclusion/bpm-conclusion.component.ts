import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BpmFileService } from 'projects/bpm/src/app/services/bpm-file.service';
import { map, take } from 'rxjs/operators';
import { BPMCommitteeService } from '../../services/bpm-committee.service';
import { Observable, Subject } from 'rxjs';
import { BpmApplicationService } from '../../services/bpm-application.service';
import {
  dictionaries,
  IDictionaryItem,
} from 'projects/shared/services/dictionary.service';
import { BpmDictionaryService } from 'projects/bpm/src/app/services/dictionary.service';
import { BpmClientProfileService } from 'projects/bpm/src/app/services/client-profile.service';
import { fadeInTrigger } from 'projects/shared/util/triggers';
import { MaritalStatus } from 'projects/shared/models/clientProfile';
import { IBpmClient } from '../../store/bpm-application.reducers';
import { IBpmAppState } from 'projects/bpm/src/app/store/bpm';
import { select, Store } from '@ngrx/store';
import { selectBpmApp } from '../../store/bpm-application.selectors';

@Component({
  selector: 'app-bpm-conclusion',
  templateUrl: './bpm-conclusion.component.html',
  styleUrls: ['./bpm-conclusion.component.scss'],
  animations: [fadeInTrigger],
})
export class BpmConclusionComponent implements OnInit {
  id: string;
  applicationTaskid: string;
  isAppAccept$ = new Subject<boolean>();
  ClientTypes$: Observable<IDictionaryItem[]>;
  Banks$: Observable<IDictionaryItem[]>;
  ClientCategories$: Observable<IDictionaryItem[]>;
  form: FormGroup;
  profile$: Observable<IBpmClient>;

  constructor(
    private fb: FormBuilder,
    private store: Store<IBpmAppState>,
    private route: ActivatedRoute,
    private serviceFile: BpmFileService,
    private committeeService: BPMCommitteeService,
    private snackbar: MatSnackBar,
    private router: Router,
    private serviceClient: BpmClientProfileService,
    private serviceDic: BpmDictionaryService,
    private service: BpmApplicationService,
    private serviceClientProfile: BpmClientProfileService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.applicationTaskid = this.route.snapshot.paramMap.get(
      'applicationTaskId'
    );
    
    this._loadClientTypes();
    this._loadBanks();
    this._loadClientCategories();
    this._initializeForm();
    this.committeeService.isAccept(this.id).subscribe((x) => {
      this.isAppAccept$.next(x);
    });
    this._loadAppBankInfo();
    // this.profile$ = this.store.pipe(
    //   select(selectBpmApp),
    //   take(1),
    //   map((x) => {
    //     // this.form.patchValue({ ...x.client, userId: x.userId });
    //     this.form.get('userId').setValue(x.userId);
    //     console.log(x);
    //     return x.client;
    //   })
    // );
  }
  getDocument = (docname: string) => {
    return this.serviceFile
      .document({ appId: this.id, name: docname, format: 'pdf' })
      .pipe(take(1))
      .subscribe((x) => {
        const blob = new Blob([x], {
          type: 'application/pdf',
        });

        this._file(blob, false);
      });
  };

  _loadAppBankInfo = () => {
    this.service
      .application(this.id)
      .pipe(
        take(1),
        map((x) => {
          this.form.get('bankId').setValue(x.application.bankId);
          this.form.get('bankAccount').setValue(x.application.bankAccount);
          this.form.get('userId').setValue(x.application.userId);
          this.serviceClientProfile
            .clientProfile(this.form.get('userId').value)
            .subscribe((x) => {
              this.form.get('clientTypeId').setValue(x.clientTypeId);
              this.form.get('companyName').setValue(x.companyName);
              this.form.get('companyActivity').setValue(x.companyActivity);
              this.form
                .get('companySerialNumber')
                .setValue(x.companySerialNumber);
              this.form
                .get('companyRegisterNumber')
                .setValue(x.companyRegisterNumber);
              this.form
                .get('companyRegisterDate')
                .setValue(x.companyRegisterDate);
              this.form.get('companyNdc').setValue(x.companyNdc);
              // this.form.get('companyAddress').setValue(x.companyAddress);
              this.form.get('clientCategoryId').setValue(x.clientCategoryId);
            });
        })
      )
      .subscribe();
  };

  _file = (blob: Blob, download: boolean) => {
    const url = URL.createObjectURL(blob);
    window.open(
      url,
      '_blank',
      `width=${screen.width / 2},height=${screen.height - 150},top=70,left=${
        screen.width / 2
      }right=100`
    );
  };
  _loadClientTypes = () => {
    this.ClientTypes$ = this.serviceDic
      .dictionaryItems(dictionaries.dicClientType)
      .pipe(take(1));
  };
  _loadBanks = () => {
    this.Banks$ = this.serviceDic
      .dictionaryItems(dictionaries.dicBank)
      .pipe(take(1));
  };
  _loadClientCategories = () => {
    this.ClientCategories$ = this.serviceDic
      .dictionaryItems(dictionaries.dicClientCategory)
      .pipe(take(1));
  };

  send = () => {
    if (!this.form.valid) return this.form.markAllAsTouched();

    this.service
      .sendManagerConclusion(this.form.value)
      .pipe(take(1))
      .subscribe(this._successResponse);
  };

  _successResponse = (x: string) => {
    this.snackbar.open('Заявка успешно отправлена!', null, {
      duration: 2500,
    });
    this.router.navigate([`/applicationList`]);
  };

  _initializeForm = () =>
    (this.form = this.fb.group({
      userId: [''],
      applicationTaskId: [this.applicationTaskid],

      clientTypeId: [null],
      companyName: [''],
      companyActivity: [''],
      companySerialNumber: [''],
      companyRegisterNumber: [''],
      companyRegisterDate: [''],
      companyNdc: [false],
      // companyAddress: [''],

      clientCategoryId: [null],
      bankId: [null, Validators.required],
      bankAccount: ['', Validators.required],

      maritalStatus: [MaritalStatus.Single],
      childrenCount: [0],
    }));
}
