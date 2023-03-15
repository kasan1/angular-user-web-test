import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  IAffillatedOrganizationTableData,
  IAffiliatedOrganization,
} from '../../../models/client.model';
import { removeAffilatedOrganisation } from '../../../store/client';
import { IOkapsAppState } from '../../../store/okaps';
import { selectAffiliatedOrganisations } from '../../../store/selectors/client.selector';
import { AffilatedCompaniesDialogFormComponent } from '../affilated-companies-dialog-form/affilated-companies-dialog-form.component';

@Component({
  selector: 'app-affilated-companies-table',
  templateUrl: './affilated-companies-table.component.html',
  styleUrls: ['./affilated-companies-table.component.scss'],
})
export class AffilatedCompaniesTableComponent implements OnInit {
  @Input() isReadOnly: boolean;
  @ViewChild(MatSort) sort: MatSort;

  ngDestroyed$ = new Subject();
  dataSource: MatTableDataSource<IAffillatedOrganizationTableData>;
  affilatedOrganizations: IAffiliatedOrganization[] = [];

  displayedColumns: string[] = [
    'fullname',
    'identifier',
    'head',
    'banks',
    'shareInCapital',
    'debts',
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
          state.client.details.organization.affiliatedOrganizations
      )
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((data) => {
        this.affilatedOrganizations = data;
      });
    selectAffiliatedOrganisations(this.store)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
      });
  }

  ngOnDestroy(): void {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  addAffilatedOrganisation() {
    this.dialogService.open(AffilatedCompaniesDialogFormComponent);
  }
  editAffilatedOrganisation(index: number) {
    this.dialogService.open(AffilatedCompaniesDialogFormComponent, {
      data: {
        index,
        state: this.affilatedOrganizations[index],
      },
    });
  }
  removeAffilatedOrganisation(index: number) {
    this.store.dispatch(removeAffilatedOrganisation(index));
  }
}
