import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { IULOwner } from 'projects/okaps/src/app/models/client.model';
import { removeUlOwner } from 'projects/okaps/src/app/store/client.extra';
import { IOkapsAppState } from 'projects/okaps/src/app/store/okaps';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { JuridicalOwnersDialogFormComponent } from '../juridical-owners-dialog-form/juridical-owners-dialog-form.component';

@Component({
  selector: 'app-juridical-owners-table',
  templateUrl: './juridical-owners-table.component.html',
  styleUrls: ['./juridical-owners-table.component.scss'],
})
export class JuridicalOwnersTableComponent implements OnInit {
  @Input() isReadOnly: boolean;
  @ViewChild(MatSort) sort: MatSort;

  ngDestroyed$ = new Subject();
  dataSource: MatTableDataSource<any>;
  owners: IULOwner[] = [];

  displayedColumns: string[] = ['fullname', 'rate', 'requisites', 'actions'];

  constructor(
    private store: Store<IOkapsAppState>,
    private dialogService: MatDialog
  ) {}

  ngOnInit(): void {
    this.store
      .select((state: IOkapsAppState) => state.clientExtraDetails.ulOwners)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((data) => {
        this.owners = data;

        this.dataSource = new MatTableDataSource(
          data.map((x) => ({
            id: x.id,
            fullname: x.fullName,
            rate: x.rate,
            requisites: x.bankAccounts
              .map((b) => `БИК: ${b.bic}, Счет: ${b.number}`)
              .join('; '),
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

    this.dialogService.open(JuridicalOwnersDialogFormComponent, {
      data: {
        initialData: null,
      },
    });
  }

  editOwner(index: number) {
    if (this.isReadOnly) return;

    const owner = this.owners[index];
    this.dialogService.open(JuridicalOwnersDialogFormComponent, {
      data: {
        initialData: owner,
        index,
      },
    });
  }

  removeOwner(index: number) {
    if (this.isReadOnly) return;

    this.store.dispatch(removeUlOwner(index));
  }
}
