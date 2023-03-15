import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ICreditHistory } from '../../../models/client.model';
import { removeCreditHistory } from '../../../store/client';
import { IOkapsAppState } from '../../../store/okaps';
import { CreditHistoryDialogFormComponent } from '../credit-history-dialog-form/credit-history-dialog-form.component';

@Component({
  selector: 'app-credit-history-table',
  templateUrl: './credit-history-table.component.html',
  styleUrls: ['./credit-history-table.component.scss'],
})
export class CreditHistoryTableComponent implements OnInit, OnDestroy {
  @Input() isReadOnly: boolean;
  @ViewChild(MatSort) sort: MatSort;

  ngDestroyed$ = new Subject();
  dataSource: MatTableDataSource<ICreditHistory>;
  creditHistory: ICreditHistory[] = [];

  displayedColumns: string[] = [
    'fullname',
    'sum',
    'dateIssue',
    'period',
    'balance',
    'actions',
  ];

  constructor(
    private store: Store<IOkapsAppState>,
    private dialogService: MatDialog
  ) {}

  ngOnInit(): void {
    this.store
      .select(
        (state: IOkapsAppState) =>
          state.client.details.organization.creditHistory
      )
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((data) => {
        this.creditHistory = data;
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
      });
  }

  ngOnDestroy(): void {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  addCreditHistory() {
    this.dialogService.open(CreditHistoryDialogFormComponent);
  }
  editCreditHistory(index: number) {
    this.dialogService.open(CreditHistoryDialogFormComponent, {
      data: {
        index,
        state: this.creditHistory[index],
      },
    });
  }
  removeCreditHistory(index: number) {
    this.store.dispatch(removeCreditHistory(index));
  }
}
