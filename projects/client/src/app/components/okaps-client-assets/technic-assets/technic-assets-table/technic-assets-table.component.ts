import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { ITechnicActivity } from 'projects/okaps/src/app/models/assets.model';
import { removeTechnicAssets } from 'projects/okaps/src/app/store/assets';
import { IOkapsAppState } from 'projects/okaps/src/app/store/okaps';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TechnicAssetsDialogFormComponent } from '../technic-assets-dialog-form/technic-assets-dialog-form.component';

@Component({
  selector: 'app-technic-assets-table',
  templateUrl: './technic-assets-table.component.html',
  styleUrls: ['./technic-assets-table.component.scss'],
})
export class TechnicAssetsTableComponent implements OnInit {
  @Input() isReadOnly: boolean;
  @ViewChild(MatSort) sort: MatSort;

  ngDestroyed$ = new Subject();
  dataSource: MatTableDataSource<ITechnicActivity>;
  technicAssets: ITechnicActivity[] = [];

  displayedColumns: string[] = [
    'fullname',
    'dateIssue',
    'count',
    'countOfCorrect',
    'isPledged',
    'pledgeDescription',
    'actions',
  ];

  constructor(
    private store: Store<IOkapsAppState>,
    private dialogService: MatDialog
  ) {}

  ngOnInit(): void {
    this.store
      .select((state: IOkapsAppState) => state.assets.technicActivities)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((data) => {
        this.technicAssets = data;
        this.dataSource = new MatTableDataSource(data);
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  addTechnicAssets() {
    if (this.isReadOnly) return;

    this.dialogService.open(TechnicAssetsDialogFormComponent, {
      data: {
        initialData: null,
      },
    });
  }

  editTechnicAssets(id: string) {
    if (this.isReadOnly) return;

    this.dialogService.open(TechnicAssetsDialogFormComponent, {
      data: {
        initialData: this.technicAssets.find((x) => x.id === id),
      },
    });
  }

  removeTechnicAssets(id: string) {
    if (this.isReadOnly) return;

    this.store.dispatch(removeTechnicAssets(id));
  }
}
