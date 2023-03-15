import {
  loadBpmApplicationChargees,
  loadBpmHoldings,
  loadBpmFinAnalysis,
} from './../../store/bpm-application.reducers';
import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { fadeInTrigger, fadeInOutTrigger } from 'projects/shared/util/triggers';
import { Store, select } from '@ngrx/store';
import { IBpmAppState } from 'projects/bpm/src/app/store/bpm';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import {
  IBpmApplicationState,
  loadBpmApplicationCondition,
} from '../../store/bpm-application.reducers';
import {
  selectBpmApp,
  selectBpmFinAnalysis,
} from '../../store/bpm-application.selectors';
import { takeWhile, map, take } from 'rxjs/operators';
import {
  IApplicationCondition,
  IApplicationEntry,
} from 'projects/shared/services/application.service';
import { ITable } from 'projects/shared/models/table';
import {
  selectBpmAppConditionsTable,
  selectBpmAppPeriodTable,
  selectBpmAppPaymentTable,
  selectBpmAppHoldingsTable,
  selectBpmAppPurposeTable,
} from '../../store/extended/bpm-application-extended.selectors';
import { IFileInfo } from 'projects/shared/models/fileInfo';
import { BpmFileService } from 'projects/bpm/src/app/services/bpm-file.service';
import { IFinAnalysis } from 'projects/shared/services/finAnalysis.service';
import { ICreditCommitteeDecision } from 'projects/shared/services/committee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BpmApplicationService } from '../../services/bpm-application.service';
import { BPMCommitteeService } from '../../services/bpm-committee.service';
import { BpmPledgeService } from '../../services/bpm-pledge.service';
import { IExpertiseResult } from 'projects/shared/services/pledge.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bpm-application',
  templateUrl: './bpm-application.component.html',
  styleUrls: ['./bpm-application.component.scss'],
  animations: [fadeInTrigger, fadeInOutTrigger],
})
export class BpmApplicationComponent implements OnInit {
  
  @Input() showSendButton: boolean = true;
  @Input() showinWorkButton: boolean = true;

  application$: Observable<IBpmApplicationState>;
  appId$ = new BehaviorSubject<string>(null);

  condition$: Observable<ITable<IApplicationCondition>>;
  period$: Observable<ITable<any>>;
  payment$: Observable<ITable<any>>;
  purpose$: Observable<ITable<any>>;
  history$: Observable<IApplicationEntry[]>;
  holdings$: Observable<
    {
      client: ITable<any>;
      name: ITable<any>;
      holding: ITable<any>;
      holding2: ITable<any>;
      nok: ITable<any>;
    }[]
  >;
  finAnalysis$: Observable<IFinAnalysis>;
  expertResults$: Observable<IExpertiseResult[]>;

  type$ = new BehaviorSubject<number>(0);

  files$ = new BehaviorSubject<IFileInfo[]>(null);
  decision$ = new BehaviorSubject<ICreditCommitteeDecision[]>(null);
  filesLoading$ = new Subject<boolean>();
  projectDescription$ = new BehaviorSubject<string>(null);

  ccResult$: Observable<IFinAnalysis>;

  applicationTaskId: string;
  loading$ = new Subject<boolean>();

  constructor(
    private store: Store<IBpmAppState>,
    private file: BpmFileService,
    private committeeService: BPMCommitteeService,
    private router: Router,
    private route: ActivatedRoute,
    private servicePledge: BpmPledgeService,
    private service: BpmApplicationService
  ) {}

  ngOnInit(): void {
    this.condition$ = this.store.pipe(select(selectBpmAppConditionsTable));
    this.period$ = this.store.pipe(select(selectBpmAppPeriodTable));
    this.payment$ = this.store.pipe(select(selectBpmAppPaymentTable));
    this.purpose$ = this.store.pipe(select(selectBpmAppPurposeTable));
    this.holdings$ = this.store.pipe(select(selectBpmAppHoldingsTable));
    this.finAnalysis$ = this.store.pipe(select(selectBpmFinAnalysis));

    this.application$ = this.store.pipe(
      select(selectBpmApp),
      takeWhile((x) => !x.id, true),
      map((x) => {
        if (!x.id) return;

        this.appId$.next(x.id);

        this._loadFinAnalysis = () => {
          this.store.dispatch(loadBpmFinAnalysis(x.id));
          this._loadFinAnalysis = () => {};
        };

        this.inWork = () => {
          this.applicationTaskId = this.route.snapshot.paramMap.get(
            'applicationTaskId'
          );
          this.router.navigate([
            `/application/inWork/${x.id}/${this.applicationTaskId}`,
          ]);
        };

        this._loadFiles = () => {
          this.filesLoading$.next(true);
          this.file
            .load({
              appId: x.id,
            })
            .pipe(
              take(1),
              map((f) => this.files$.next(f))
            )
            .subscribe(
              (x) => this.filesLoading$.next(false),
              () => this.filesLoading$.next(false)
            );
        };

        this._loadProjectDescription = () => {
          if (!this.projectDescription$.value)
            this.projectDescription$.next(x.projectDescription || 'Не указано');
        };

        this._loadExpertiseResult = () => {
          this.expertResults$ = this.servicePledge
            .getExpertiseResults(x.id)
            .pipe(
              take(1),
              map((items) =>
                items.filter((item) => item.expertiseName != 'HeadDueExpertise')
              )
            );
        };

        this._loadDecision = () => {
          this.committeeService
            .decision(x.id)
            .pipe(
              take(1),
              map((d) => this.decision$.next(d))
            )
            .subscribe();
        };

        this.store.dispatch(loadBpmApplicationCondition(x.id));
        this.store.dispatch(loadBpmApplicationChargees(x.id));
        this.store.dispatch(
          loadBpmHoldings({
            applicationId: x.id,
            column: 'Id',
            direction: 'asc',
            pageIndex: 0,
            pageSize: 100,
          })
        );
        return x;
      })
    );
  }

  inWork = () => {};

  switchType = (x: number) => {
    console.log(x);
    this.type$.next(x);
    switch (x) {
      case 1:
        return this._loadFinAnalysis();
      case 2:
        return this._loadProjectDescription();
      case 3:
      case 4:
        if (!this.files$.value) this._loadFiles();
        return;
      case 5:
        return this._loadExpertiseResult();
      case 6:
        return this._loadDecision();
      case 7:
        return this._loadHistory();
      default:
        return;
    }
  };

  _loadFinAnalysis = () => {};
  _loadProjectDescription = () => {};
  _loadFiles = () => {};
  _loadExpertiseResult = () => {};
  _loadDecision = () => {};
  _loadHistory = () => {
    this.history$ = this.service
      .history(this.route.snapshot.paramMap.get('id'))
      .pipe(take(1));
  };

  sendManager = () => {
    const id = this.route.snapshot.paramMap.get('id');
    const applicationTaskId = this.route.snapshot.paramMap.get(
      'applicationTaskId'
    );
    if (!id) return;

    this.loading$.next(true);

    this.service
      .sendManager(applicationTaskId)
      .pipe(take(1))
      .subscribe(
        () => {
          this.loading$.next(false);
          this.router.navigate([`/applicationList`], {
            replaceUrl: true,
          });
        },
        () => this.loading$.next(false)
      );
  };
}
