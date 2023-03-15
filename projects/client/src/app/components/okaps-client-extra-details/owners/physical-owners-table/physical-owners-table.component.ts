import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { IFLOwner } from 'projects/okaps/src/app/models/client.model';
import { removeFlOwner } from 'projects/okaps/src/app/store/client.extra';
import { IOkapsAppState } from 'projects/okaps/src/app/store/okaps';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PhysicalOwnersDialogFormComponent } from '../physical-owners-dialog-form/physical-owners-dialog-form.component';

@Component({
  selector: 'app-physical-owners-table',
  templateUrl: './physical-owners-table.component.html',
  styleUrls: ['./physical-owners-table.component.scss'],
})
export class PhysicalOwnersTableComponent implements OnInit {
  @Input() isReadOnly: boolean;
  @ViewChild(MatSort) sort: MatSort;

  ngDestroyed$ = new Subject();
  dataSource: MatTableDataSource<any>;
  owners: IFLOwner[] = [];

  displayedColumns: string[] = [
    'fullname',
    'identificationDocument',
    'address',
    'actions',
  ];

  constructor(
    private store: Store<IOkapsAppState>,
    private dialogService: MatDialog
  ) {}

  ngOnInit(): void {
    this.store
      .select((state: IOkapsAppState) => state.clientExtraDetails.flOwners)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((data) => {
        this.owners = data;

        this.dataSource = new MatTableDataSource(
          data.map((x) => ({
            id: x.id,
            fullname: x.fullName,
            identificationDocument: `№ ${x.identificationDocument.number}, ${
              x.identificationDocument.issuer
            }, ${
              new Date(x.identificationDocument.dateIssue)
                .toISOString()
                .split('T')[0]
            }`,
            address: x.address.fact,
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

  addOwner() {
    if (this.isReadOnly) return;

    this.dialogService.open(PhysicalOwnersDialogFormComponent, {
      data: {
        initialData: null,
      },
    });
  }

  editOwner(index: number) {
    if (this.isReadOnly) return;

    const owner = this.owners[index];
    this.dialogService.open(PhysicalOwnersDialogFormComponent, {
      data: {
        initialData: owner,
        index,
      },
    });
  }

  removeOwner(index: number) {
    if (this.isReadOnly) return;

    this.store.dispatch(removeFlOwner(index));
  }
}
