import { OnInit, OnDestroy, Component } from '@angular/core';
import { fadeInTrigger, fadeInOutTrigger } from 'projects/shared/util/triggers';
import { removeContainer, addContainer } from 'projects/shared/util/container';

import { Store, select } from '@ngrx/store';
import { Observable, Subject, of, BehaviorSubject, noop } from 'rxjs';
import { IBpmAppState } from 'projects/bpm/src/app/store/bpm';
import { IBpmUser } from 'projects/bpm/src/app/models/bpm-user';
import { bpmAuthSelectors } from 'projects/bpm/src/app/store/selectors/auth.selectors';
import { BPMCommitteeService } from '../../services/bpm-committee.service';
import { map, catchError, tap, switchMap, take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ICreditCommitteeResult } from 'projects/shared/services/committee.service';
import { BpmDialogComponent } from 'projects/bpm/src/app/components/bpm-dialog/bpm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { BpmLazyLoaderService } from 'projects/bpm/src/app/services/lazy-loader.service';
import { BpmPledgeService } from '../../services/bpm-pledge.service';
import { BpmJuristService } from '../../services/bpm-jurist.service';
import { IJuristResult } from 'projects/shared/services/jurist.service';
import { selectBpmApp } from '../../store/bpm-application.selectors';
import { IBpmApplicationState } from '../../store/bpm-application.reducers';

@Component({
    selector: 'bpm-credit-committee',
    templateUrl: './bpm-credit-committee.component.html',
    styleUrls: ['./bpm-credit-committee.component.scss'],
    animations: [fadeInTrigger, fadeInOutTrigger],
})

export class BpmCreditCommittee implements OnInit, OnDestroy {

  userResult: ICreditCommitteeResult;
  user$: Observable<IBpmUser>;
  loading$ = new Subject<boolean>();
  appId: string;
  appTaskId: string;
  juristResults$ = new BehaviorSubject<IJuristResult[]>(null);
  finalSum: number;
  app$: Observable<IBpmApplicationState>
  
  constructor(
    private store: Store<IBpmAppState>,
    private committeeService: BPMCommitteeService,
    private snackbar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,    
    private loader: BpmLazyLoaderService,
    private pledgeService: BpmPledgeService,
    private juristService: BpmJuristService,
  ){
    
  }
    
  ngOnInit(): void {
    removeContainer();
    this.appId = this.route.snapshot.paramMap.get('id');
    this.appTaskId = this.route.snapshot.paramMap.get('applicationTaskId');
    
    this.user$ = this.store.pipe(select(bpmAuthSelectors.selectUser));

    this.pledgeService.getLoanFinalSum(this.appId).pipe(take(1)).subscribe((x) => this.finalSum = x);

    this._loadNotes();
    this._trackApplication();

    //this.committeeService.userResult(this.appId).pipe(take(1), res => {this.userResult = res});
  }  

  _loadNotes = () => {
    this.juristService
      .getJuristResults(this.appId)
      .pipe(take(1))
      .subscribe((x) => this.juristResults$.next(x));
  };

  accept(): void {
    
    this.loading$.next(true);

    bpmAuthSelectors
    .selectUserOnce(this.store)
    .pipe(switchMap((user) => (user ? this._agreement(user, true) : of(null))))
    .subscribe(
      noop,
      () => (this.loading$.next(false)),
      () => (this.loading$.next(false))
    );
  }

  decline(): void {
    this.loading$.next(true);

    bpmAuthSelectors
    .selectUserOnce(this.store)
    .pipe(switchMap((user) => (user ? this._agreement(user, false) : of(null))))
    .subscribe(
      noop,
      () => (this.loading$.next(false)),
      () => (this.loading$.next(false))
    );
  }


  _agreement = (user: IBpmUser, isAccept: boolean) =>
  this.dialog
    .open(BpmDialogComponent, {
      disableClose: true,
      hasBackdrop: true,
      autoFocus: true,
      panelClass: ['d-lg', 'xl-md'],
      data: {
        method: this.loader.loadAgreementComponent,
        iin: user.iin,
        lastName: user.lastName,
        firstName: user.firstName,
        middleName: user.middleName,
        finalSum: this.finalSum,

      },
    })
    .afterClosed()
    .pipe(
      switchMap((closeResult) =>
        closeResult
          ? of(null).pipe(
              tap(() =>
                this.snackbar.open('Договор успешно подписан', null, {
                  duration: 1000,
                })
              ),
              switchMap(() => this._sendResult(isAccept))
            )
          : of(null)
      )
    );


    _sendResult = (isAccept: boolean) => {

      return this.committeeService
      .committeeSet(
        {
        applicationId: this.appId,
        applicationTaskId:this.appTaskId,
        accept: isAccept,
        }
      ).pipe(take(1),
        map((result) => {
          if (result) {
            this.snackbar.open(
              'Успешно проголосовано!',
              null,
              { duration: 1000 }
            );
  
            this.loading$.next(false);
            
            this.router.navigate([`/applicationList/`]);
          }
        }),
        catchError(() =>
          of(null).pipe(tap(() => this.loading$.next(false)))
        )
      );    
    }    

  _trackApplication = () => {

    this.app$ = this.store.pipe(select(selectBpmApp))
  }

  method = (x: number) => {
    switch (x) {
      case 1:
        return 'Аннуитетный';
      case 2:
        return 'Дифферинцированный';
      default:
        return 'Не указано';
    }
  };

  period = (x: number) => {
    switch (x) {
      case 1:
        return 'Ежемесячно';
      case 2:
        return 'Ежеквартально';
      case 3:
        return '1 раз в полгода';
      case 4:
        return '1 раз в год';
      default:
        return 'Не указано';
    }
  };

  ngOnDestroy() {
    addContainer();
  }  
}