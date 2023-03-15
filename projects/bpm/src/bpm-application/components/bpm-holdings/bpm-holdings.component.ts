import {
  selectHoldingsFilter,
  selectHoldingsLoading,
} from './../../../../../shared/store/holding/holding.selectors';
import {
  selectBpmApp,
  selectBpmLiquiditySummary,
} from './../../store/bpm-application.selectors';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { fadeInTrigger, fadeInOutTrigger } from 'projects/shared/util/triggers';
import { MatDialog } from '@angular/material/dialog';
import { BpmHoldingDialogComponent } from '../bpm-holding-dialog/bpm-holding-dialog.component';
import { Store, select } from '@ngrx/store';
import { IBpmAppState } from 'projects/bpm/src/app/store/bpm';
import { Observable, Subject } from 'rxjs';
import {
  IBpmApplicationState,
  bpmHoldingsPageChanged,
  bpmHoldingsSortChanged,
  loadBpmHoldings,
  bpmSetHoldingLoading,
  loadBpmLiquiditySummary,
} from '../../store/bpm-application.reducers';
import { ITable, TableFunctionality } from 'projects/shared/models/table';
import { IHoldingEntry } from 'projects/shared/store/holding/holdingInitial';
import { map, take, takeWhile } from 'rxjs/operators';
import { selectHoldingsTable } from 'projects/shared/store/holding/holding.selectors';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ILiquiditySummary } from 'projects/shared/services/pledge.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bpm-holdings',
  templateUrl: './bpm-holdings.component.html',
  styleUrls: ['./bpm-holdings.component.scss'],
  animations: [fadeInTrigger, fadeInOutTrigger],
})
export class BpmHoldingsComponent
  extends TableFunctionality<IHoldingEntry>
  implements OnInit {
  application$: Observable<IBpmApplicationState>;
  liquiditySummary$: Observable<ILiquiditySummary>;
  table$ = new Subject<ITable<IHoldingEntry>>();
  holdingsLoading$ = new Subject<boolean>();

  constructor(private dialog: MatDialog, private store: Store<IBpmAppState>) {
    super();
  }

  ngOnInit(): void {
    this.liquiditySummary$ = this.store.pipe(select(selectBpmLiquiditySummary));

    this.application$ = this.store.pipe(
      select(selectBpmApp),
      map((x) => {
        this.table$.next(selectHoldingsTable(x));
        this.holdingsLoading$.next(selectHoldingsLoading(x));

        return x;
      })
    );

    this.store
      .pipe(
        select(selectBpmApp),
        takeWhile((x) => !x.id, true),
        map((x) => {
          if (!x.id) return;

          this._loadHoldings();

          this._loadSummary = () =>
            this.store.dispatch(loadBpmLiquiditySummary(x.id));
          this._loadSummary();
        })
      )
      .subscribe();

    this.handlePageChange = (event: PageEvent) => {
      this.store.dispatch(bpmHoldingsPageChanged(event));
      this._loadHoldings();
    };
    this.handleSortChange = (event: Sort) => {
      this.store.dispatch(bpmHoldingsSortChanged(event));
      this._loadHoldings();
    };
  }

  holdingDialog = (applicationId: string, event?: IHoldingEntry) =>
    this.dialog
      .open(BpmHoldingDialogComponent, {
        panelClass: ['d-lg'],
        hasBackdrop: true,
        autoFocus: true,
        data: {
          applicationId,
          id: event ? event.id : null,
        },
      })
      .afterClosed()
      .pipe(
        take(1),
        map((x) => {
          if (x) {
            //HoldingSignal.signal$.next();
            this._loadHoldings();
            this._loadSummary();
          }
        })
      )
      .subscribe();

  _loadHoldings = () => {
    this.store.dispatch(bpmSetHoldingLoading(true));
    this.store
      .pipe(
        select(selectBpmApp),
        take(1),
        map((x) => {
          const filter = selectHoldingsFilter(x);
          this.store.dispatch(
            loadBpmHoldings({ ...filter, applicationId: x.id })
          );
        })
      )
      .subscribe();
  };

  _loadSummary = () => {};
}

export class HoldingSignal {
  static signal$ = new Subject();
}
