import { min } from 'lodash';
import { bpmAuthSelectors } from './../../../app/store/selectors/auth.selectors';
import { IBpmUser } from './../../../app/models/bpm-user';
import { pledgeName } from './../../../../../shared/store/holding/holding.selectors';
import { IHoldingEntry } from 'projects/shared/store/holding/holdingInitial';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject } from 'rxjs';
import { BpmPledgeService } from '../../services/bpm-pledge.service';
import { BpmApplicationService } from '../../services/bpm-application.service';
import { take, map, debounceTime } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { IBpmAppState } from 'projects/bpm/src/app/store/bpm';
import { ActivatedRoute, Router } from '@angular/router';
import {
  PledgeFirstLevel,
  PledgeSecondLevel,
  PledgeThirdLevel,
} from 'projects/shared/services/pledge.service';

@Component({
  selector: 'app-bpm-pledge',
  templateUrl: './bpm-pledge.component.html',
  styleUrls: ['./bpm-pledge.component.scss'],
})
export class BpmPledgeComponent implements OnInit {
  id: string;
  applicationTaskId: string;
  pledges$: Observable<IHoldingEntry[]>;
  form: FormGroup;
  currentDate = new Date();
  user$: Observable<IBpmUser>;
  saving$ = new Subject<boolean>();

  constructor(
    private service: BpmPledgeService,
    private serviceApp: BpmApplicationService,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private store: Store<IBpmAppState>,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.applicationTaskId = this.route.snapshot.paramMap.get(
      'applicationTaskId'
    );
    this.user$ = this.store.pipe(select(bpmAuthSelectors.selectUser));
    this._initializeForm();
    this._loadPledges();
    this._loadAppComment();

    // this.form.get('expertSum').valueChanges.pipe(
    //   debounceTime(200),
    //   map((x) => {
    //     console.log(x);
    //   })
    // );
    this._trackSum();
  }

  _loadPledges = () => {
    this.pledges$ = this.service
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
            // if (
            //   item.firstLevel == PledgeFirstLevel.Nonmovable &&
            //   item.secondLevel == PledgeSecondLevel.Living
            // )
            //   return;

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
          this.form
            .get('clientCommentRk')
            .setValue(x.application.pledgeComment);
        })
      )
      .subscribe();
  };

  submit = () => {
    this.service
      .updatePledgerResult(this.form.value)
      .subscribe(this._successResponse, () => this.saving$.next(false));
  };

  _successResponse = (x: string) => {
    this.snackbar.open('Заявка успешно отправлена!', null, {
      duration: 2500,
    });
    this.saving$.next(false);
    this.router.navigate([`/applicationList`]);
  };

  pledges = () => this.form.get('pledges') as FormArray;
  _initializeForm = () =>
    (this.form = this.fb.group({
      applicationId: [this.id],
      applicationTaskId: [this.applicationTaskId],
      clientCommentRk: [''],
      finalSums: [0],
      pledges: this.fb.array([]),
    }));

  _pledgeItem = () =>
    this.fb.group({
      id: [''],
      nokSum: [0],
      expertSum: [0],
      expertiseSum: [0],
      coefficient: [0],
      pledgeSum: [0],
      finalSum: [0],
    });

  _trackSum = () => {
    this.form.valueChanges
      .pipe(
        debounceTime(150),
        map((x: any) => {
          const pledges = this.pledges().controls;
          var finalSums = 0;

          for (let i = 0; i < pledges.length; i++) {
            var arr = [
              pledges[i].get('nokSum').value,
              pledges[i].get('expertSum').value,
              pledges[i].get('expertiseSum').value,
            ];

            arr = arr.filter((x) => x > 0);
            var finalSum =
              Math.min(...arr) * pledges[i].get('coefficient').value;
            finalSums = finalSums + finalSum;
            pledges[i].get('finalSum').setValue(finalSum.toFixed(2));
          }
          this.form.get('finalSums').setValue(finalSums.toFixed(2));
        })
      )
      .subscribe();
  };
}
