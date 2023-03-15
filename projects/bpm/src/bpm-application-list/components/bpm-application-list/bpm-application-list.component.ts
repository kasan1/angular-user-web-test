import {
  ApplicationType,
  IApplicationEntry,
} from './../../../../../shared/services/application.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { IBpmAppState } from 'projects/bpm/src/app/store/bpm';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { ITable, TableFunctionality } from 'projects/shared/models/table';
import {
  loadBpmApplications,
  bpmAppListPageChanged,
  bpmAppListSortChanged,
  loadBpmApplicationStatistics,
  IBpmApplicationsListState,
  setBpmAppListLoading,
  setBpmAppListPagination,
  clearBpmAppList,
} from '../../store/bpm-application-list.reducers';
import {
  selectBpmAppListLoading,
  selectBpmAppListCurrent,
  selectBpmAppListFilter,
  selectBpmAppList,
} from '../../store/bpm-application-list.selectors';
import { fadeInOutTrigger, fadeInTrigger } from 'projects/shared/util/triggers';
import { ActivatedRoute, Router } from '@angular/router';
import { map, take, takeUntil } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { removeContainer, addContainer } from 'projects/shared/util/container';

@Component({
  selector: 'bpm-application-list',
  templateUrl: './bpm-application-list.component.html',
  styleUrls: ['./bpm-application-list.component.scss'],
  animations: [fadeInOutTrigger, fadeInTrigger],
})
export class BpmApplicationListComponent
  extends TableFunctionality<IApplicationEntry>
  implements OnInit, OnDestroy {
  table$: Observable<ITable<IApplicationEntry>>;
  statistics$: Observable<Partial<IBpmApplicationsListState>>;
  loading$: Observable<boolean>;
  currentType$ = new BehaviorSubject<ApplicationType>(null);
  ngDestroyed$ = new Subject();

  applicationType = ApplicationType;
  searchForm: FormGroup;

  constructor(
    private store: Store<IBpmAppState>,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    removeContainer();

    this._initializeForm();
    this._trackTable();
    this._trackStatistics();
    this._loadStatistics();

    this.route.queryParamMap
      .pipe(
        takeUntil(this.ngDestroyed$),
        map((x) => {
          const type = x.get('type');
          if (!type) return;

          this.currentType$.next(+type);
          this._loadApplications();
        })
      )
      .subscribe();

    if (!this.currentType$.value)
      this.router.navigate([], {
        queryParams: {
          type: ApplicationType.CMNew,
        },
      });
  }

  switchType = (type: ApplicationType) => {
    this._search().setValue('');
    this.store.dispatch(
      setBpmAppListPagination({ pageIndex: 0, pageSize: 10 })
    );
    this.router.navigate([], {
      queryParams: {
        type,
      },
    });
  };

  search = () => {
    this.store.dispatch(
      setBpmAppListPagination({ pageIndex: 0, pageSize: 10 })
    );
    this._loadApplications();
  };

  _trackTable = () => {
    this.loading$ = this.store.pipe(select(selectBpmAppListLoading));
    this.table$ = this.store.pipe(select(selectBpmAppListCurrent));

    this.handlePageChange = (x: PageEvent) => {
      this.store.dispatch(bpmAppListPageChanged(x));
      this._loadApplications();
    };

    this.handleSortChange = (x: Sort) => {
      this.store.dispatch(bpmAppListSortChanged(x));
      this._loadApplications();
    };

    this.handleSelectionChange = (x: IApplicationEntry) => {
      switch (x.status) {
        case ApplicationType.CMNew:
          this.router.navigate([
            `/application/preview/${x.id}/${x.applicationTaskId}`,
          ]);
          break;
        case ApplicationType.CMInWork:
          this.router.navigate([
            `/application/inWork/${x.id}/${x.applicationTaskId}`,
          ]);
          break;
        case ApplicationType.CMRework:
          this.router.navigate([
            `/application/reWork/${x.id}/${x.applicationTaskId}`,
          ]);
          break;
        case ApplicationType.CMFinished:
          this.router.navigate([
            `/application/final/${x.id}/${x.applicationTaskId}`,
          ]);
          break;
        case ApplicationType.PrepareCreditDossier:
          this.router.navigate([
            `/application/conclusion/${x.id}/${x.applicationTaskId}`,
          ]);
          break;

        case ApplicationType.URBoss:
          this.router.navigate([
            `/application/uristboss/${x.id}/${x.applicationTaskId}`,
          ]);
          break;
        case ApplicationType.EPledgeBoss:
          this.router.navigate([
            `/application/pledgeboss/${x.id}/${x.applicationTaskId}`,
          ]);
          break;
        case ApplicationType.EPledge:
          this.router.navigate([
            `/application/bpmpledge/${x.id}/${x.applicationTaskId}`,
          ]);
          break;
        case ApplicationType.EAct:
          this.router.navigate([
            `/application/actvisit/${x.id}/${x.applicationTaskId}`,
          ]);
          break;
        case ApplicationType.URNew:
          this.router.navigate([
            `/application/urist/${x.id}/${x.applicationTaskId}`,
          ]);
          break;
        case ApplicationType.CCNew:
          this.router.navigate([
            `/application/committee/${x.id}/${x.applicationTaskId}`,
          ]);
          break;
        default:
          console.log(x);
          break;
      }
    };
  };

  _loadApplications = () => {
    this.store.dispatch(setBpmAppListLoading(true));
    this.store
      .pipe(
        select(selectBpmAppListFilter),
        take(1),
        map((x) =>
          this.store.dispatch(
            loadBpmApplications({
              type: this.currentType$.value,
              ...x,
              search: this._search().value,
            })
          )
        )
      )
      .subscribe();
  };

  _trackStatistics = () =>
    (this.statistics$ = this.store.pipe(select(selectBpmAppList)));

  _loadStatistics = () => {
    this.store.dispatch(setBpmAppListLoading(true));
    this.store.dispatch(loadBpmApplicationStatistics());
  };

  _initializeForm = () =>
    (this.searchForm = this.fb.group({
      search: [''],
    }));

  _search = (): AbstractControl => this.searchForm.get('search');

  ngOnDestroy() {
    addContainer();

    this.store.dispatch(clearBpmAppList());
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }
}
