import { pledgeName } from './../../../../../shared/store/holding/holding.selectors';
import { IHoldingEntry } from 'projects/shared/store/holding/holdingInitial';
import {
  IChargee,
  IExpertiseResult,
} from './../../../../../shared/services/pledge.service';
import {
  IDictionaryItem,
  dictionaries,
} from 'projects/shared/services/dictionary.service';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { fadeInTrigger, fadeInOutTrigger } from 'projects/shared/util/triggers';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject, of, Subscription, BehaviorSubject } from 'rxjs';
import { BpmDictionaryService } from 'projects/bpm/src/app/services/dictionary.service';
import { BpmApplicationService } from '../../services/bpm-application.service';
import { take, map, debounceTime, switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogComponent } from 'projects/shared/components/confirmation-dialog/confirmation-dialog.component';
import { IJuristResult } from 'projects/shared/services/jurist.service';
import { BpmPledgeService } from '../../services/bpm-pledge.service';
import { BpmJuristService } from '../../services/bpm-jurist.service';

@Component({
  selector: 'app-bpm-urist',
  templateUrl: './bpm-urist.component.html',
  styleUrls: ['./bpm-urist.component.scss'],
  animations: [fadeInTrigger, fadeInOutTrigger],
})
export class BpmUristComponent implements OnInit, OnDestroy {
  pledges$: Observable<IHoldingEntry[]>;
  chargees$: Observable<IChargee[]>;
  filesLoading$ = new Subject<boolean>();
  DocClassifs$: Observable<IDictionaryItem[]>;
  DocClassifs2$: Observable<IDictionaryItem[]>;
  DocClassifs3$ = new BehaviorSubject<IDictionaryItem[]>(null);

  juristResults$ = new BehaviorSubject<IJuristResult[]>(null);

  id: string;
  saving$ = new Subject<boolean>();
  form: FormGroup;
  haveNote$ = new Subject<boolean>();
  isReturned$ = new Subject<boolean>();
  applicationTaskId: string;

  constructor(
    private dialog: MatDialog,
    private service: BpmJuristService,
    private pledgeService: BpmPledgeService,
    private serviceDic: BpmDictionaryService,
    private serviceApp: BpmApplicationService,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.applicationTaskId = this.route.snapshot.paramMap.get(
      'applicationTaskId'
    );
    this._initializeForm();
    this._loadAppComment();
    this._loadPledges();
    this._loadChargees();
    this._loadDocClassifications();
    this._trackNote();
    this._trackNoteLevel1();
    this._trackNoteLevel2();
    this._loadNotes();
    this._loadStatus();
  }
  _loadPledges = () => {
    this.pledges$ = this.pledgeService
      .loadPledges({
        applicationId: this.id,
        pageIndex: 0,
        pageSize: 1000,
        direction: 'asc',
        column: 'Id',
      })
      .pipe(
        take(1),
        map((x) => {
          x.items.forEach((item) => {
            item.name = pledgeName(
              item.firstLevel,
              item.secondLevel,
              item.thirdLevel
            );

            const pledgeItem = this._pledgeItem();
            pledgeItem.patchValue(item);
            this.pledges().push(pledgeItem);
          });
          return x.items;
        })
      );
  };

  _loadAppComment = () => {
    this.serviceApp
      .application(this.id)
      .pipe(
        take(1),
        map((x) => {
          //console.log(x.application.cliLegalCommentRk);
          this.form.get('juristComment').setValue(x.application.juristComment);
          this.form
            .get('clientCommentVnd')
            .setValue(x.application.cliLegalCommentVnd);
          this.form
            .get('clientResultVnd')
            .setValue(x.application.cliLegalResultVnd);
          this.form
            .get('clientCommentRk')
            .setValue(x.application.cliLegalCommentRk);
          this.form
            .get('clientResultRk')
            .setValue(x.application.cliLegalResultRk);
        })
      )
      .subscribe();
  };

  _loadChargees = () => {
    this.chargees$ = this.pledgeService.chargeesByAppId(this.id).pipe(
      take(1),
      map((x) => {
        x.forEach((item) => {
          const chargeeItem = this._chargeeItem();
          chargeeItem.patchValue(item);
          this.chargees().push(chargeeItem);
        });
        return x;
      })
    );
  };

  _loadNotes = () => {
    this.service
      .getJuristResults(this.id)
      .pipe(take(1))
      .subscribe((x) => this.juristResults$.next(x));
  };
  _loadStatus = () => {
    this.pledgeService
      .getExpertiseResults(this.id)
      .pipe(take(1))
      .subscribe((r: IExpertiseResult[]) => {
        if (r.filter((v) => v.expertiseName == 'DueExpertise').length > 0) {
          this.isReturned$.next(true);
        } else {
          this.isReturned$.next(false);
        }
      });
  };

  submit1 = () => {
    this.service
      .updateJuristComment(this.form.value)
      .subscribe(this._successResponse, () => this.saving$.next(false));
  };

  chargees = () => this.form.get('chargees') as FormArray;
  pledges = () => this.form.get('pledges') as FormArray;

  _successResponse = (x: string) => {
    this.snackbar.open('Заявка успешно отправлена!', null, {
      duration: 2500,
    });
    this.saving$.next(false);
    this.router.navigate([`/applicationList`]);
  };

  _initializeForm = () =>
    (this.form = this.fb.group({
      applicationId: [this.id],
      juristComment: [''],
      clientCommentVnd: [''],
      clientResultVnd: [false],
      clientCommentRk: [''],
      clientResultRk: [false],
      applicationTaskId: [this.applicationTaskId],
      chargees: this.fb.array([]),
      pledges: this.fb.array([]),
      noteLevel1: [0],
      noteLevel2: [0],
      noteLevel3: [0],
    }));

  _trackNote = () =>
    (this.hasNoteSub = this.form.valueChanges
      .pipe(
        debounceTime(150),
        map((x: any) => {
          const pledges = this.pledges().controls;

          for (let i = 0; i < pledges.length; i++)
            if (
              pledges[i].get('legalResultVnd').value === false ||
              pledges[i].get('legalResultRk').value === false
            )
              return this.haveNote$.next(true);

          const chargees = this.chargees().controls;

          for (let i = 0; i < chargees.length; i++)
            if (
              chargees[i].get('legalResultVnd').value === false ||
              chargees[i].get('legalResultRk').value === false
            )
              return this.haveNote$.next(true);

          if (
            this.form.get('clientResultVnd').value === false ||
            this.form.get('clientResultRk').value === false
          )
            return this.haveNote$.next(true);

          return this.haveNote$.next(false);
        })
      )
      .subscribe());

  _chargeeItem = () =>
    this.fb.group({
      id: [''],
      fullName: [''],
      iin: [''],
      legalCommentVnd: [''],
      legalResultVnd: [false],
      legalCommentRk: [''],
      legalResultRk: [false],
    });

  _pledgeItem = () =>
    this.fb.group({
      id: [''],
      legalCommentVnd: [''],
      legalResultVnd: [false],
      legalCommentRk: [''],
      legalResultRk: [false],
    });

  _loadDocClassifications = () => {
    this.DocClassifs$ = this.serviceDic
      .dictionaryItems(dictionaries.dicDocClassification)
      .pipe(
        take(1)
        // map((x) => console.log(x))
      );

    //this.cdr.detectChanges();
  };

  _trackNoteLevel1 = () =>
    (this.DocClassifs2$ = this.form.valueChanges.pipe(
      debounceTime(150),
      switchMap((x: any) =>
        this.form.get('noteLevel1').value != '' &&
        this.form.get('noteLevel1').value != '0'
          ? this.service.сlassificationSubtitles(
              this.form.get('noteLevel1').value
            )
          : of(null)
      )
    ));

  _trackNoteLevel2 = () =>
    (this.docSub = this.form.valueChanges
      .pipe(
        debounceTime(150),
        switchMap((x: any) =>
          this.form.get('noteLevel2').value != '' &&
          this.form.get('noteLevel2').value != '0'
            ? this.service
                .warningClassification(this.form.get('noteLevel2').value)
                .pipe(take(1))
            : of(null)
        )
      )
      .subscribe((x) => this.DocClassifs3$.next(x)));

  addClassifComment = () => {
    this.service
      .addJuristResult({
        applicationId: this.id,
        warningClassificationId: this.form.get('noteLevel3').value,
      })
      .pipe(take(1))
      .subscribe((x) => {
        this.form.get('noteLevel1').setValue(0);
        this.form.get('noteLevel2').setValue(0);
        this.form.get('noteLevel3').setValue(0);

        this._loadNotes();
      });
  };

  deleteClassifComment = (x: IJuristResult) => {
    console.log(x);
    this.dialog
      .open(ConfirmationDialogComponent, {
        panelClass: ['d-lg', 'md-md', 'xl-sm'],
        data: {
          title: 'Подтверждение',
          text: `Подтвердите удаление классификатора замечаний ${x.warningClassificationText}.`,
        },
      })
      .afterClosed()
      .pipe(
        take(1),
        switchMap((result) =>
          result
            ? this.service.deleteJuristResult(x.juristResultId).pipe(
                take(1),
                map(() => x)
              )
            : of(null)
        )
      )
      .subscribe((r: IJuristResult) => {
        if (!r) return;
        const values = this.juristResults$.value
          ? [...this.juristResults$.value]
          : null;

        if (!values) return;

        this.juristResults$.next(
          values.filter((v) => v.juristResultId != r.juristResultId)
        );
      });
  };

  hasNoteSub: Subscription;
  docSub: Subscription;
  ngOnDestroy() {
    if (this.hasNoteSub) this.hasNoteSub.unsubscribe();
    if (this.docSub) this.docSub.unsubscribe();
  }
}
