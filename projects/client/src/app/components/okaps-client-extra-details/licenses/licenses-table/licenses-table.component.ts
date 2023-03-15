import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { IOrganizationLicense } from 'projects/okaps/src/app/models/client.model';
import { removeLicense } from 'projects/okaps/src/app/store/client.extra';
import { IOkapsAppState } from 'projects/okaps/src/app/store/okaps';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LicensesDialogFormComponent } from '../licenses-dialog-form/licenses-dialog-form.component';

@Component({
  selector: 'app-licenses-table',
  templateUrl: './licenses-table.component.html',
  styleUrls: ['./licenses-table.component.scss'],
})
export class LicensesTableComponent implements OnInit {
  @Input() isReadOnly: boolean;
  @ViewChild(MatSort) sort: MatSort;

  ngDestroyed$ = new Subject();
  dataSource: MatTableDataSource<any>;
  licenses: IOrganizationLicense[] = [];

  displayedColumns: string[] = [
    'numberAndIssueDate',
    'issuer',
    'essence',
    'actions',
  ];

  constructor(
    private store: Store<IOkapsAppState>,
    private dialogService: MatDialog
  ) {}

  ngOnInit(): void {
    this.store
      .select((state: IOkapsAppState) => state.clientExtraDetails.licenses)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((data) => {
        this.licenses = data;

        this.dataSource = new MatTableDataSource(
          data.map((x) => ({
            id: x.id,
            numberAndIssueDate: `${x.document.number}, ${
              new Date(x.document.dateIssue).toISOString().split('T')[0]
            }`,
            issuer: x.document.issuer,
            essence: x.essence,
          }))
        );
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  addLicense() {
    if (this.isReadOnly) return;

    this.dialogService.open(LicensesDialogFormComponent, {
      data: {
        initialData: null,
      },
    });
  }

  editLicense(index: number) {
    if (this.isReadOnly) return;

    const license = this.licenses[index];
    this.dialogService.open(LicensesDialogFormComponent, {
      data: {
        initialData: license,
        index,
      },
    });
  }

  removeLicense(index: number) {
    if (this.isReadOnly) return;

    this.store.dispatch(removeLicense(index));
  }
}
