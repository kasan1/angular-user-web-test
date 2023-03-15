import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { IDictionaryBase } from '../../../models/common.model';
import { ILizingContract, IProvisioning } from '../../../models/lizing.model';
import { DictionariesService } from '../../../services/dictionaries.service';
import { removeProvisioning } from '../../../store/lizing';
import { IOkapsAppState } from '../../../store/okaps';
import { ProvisioningFormDialogComponent } from '../provisioning-form-dialog/provisioning-form-dialog.component';

@Component({
  selector: 'app-provisioning-table',
  templateUrl: './provisioning-table.component.html',
  styleUrls: ['./provisioning-table.component.scss'],
})
export class ProvisioningTableComponent implements OnInit {
  @Input() id: string;
  @Input() isReadOnly: boolean = false;
  @ViewChild(MatSort) sort: MatSort;

  ngDestroyed$ = new Subject();
  dataSource: MatTableDataSource<IProvisioning>;
  displayedColumns: string[] = [
    'position',
    'type',
    'description',
    'sum',
    'actions',
  ];

  provisionings: IProvisioning[] = [];
  provisioningTypes: IDictionaryBase[] = [];
  provisioningDescriptions: IDictionaryBase[] = [];

  constructor(
    private store: Store<IOkapsAppState>,
    private dialogService: MatDialog,
    private dictionaryService: DictionariesService
  ) {}

  ngOnInit(): void {
    this.store
      .pipe(
        select((state: IOkapsAppState) => state.lizing.contractsData[this.id]),
        map((contract: ILizingContract | undefined) => {
          if (contract !== undefined) {
            this.provisionings = contract.provisions;
            return contract.provisions;
          }
          return [];
        })
      )
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((data: IProvisioning[]) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
      });

    this.dictionaryService.getProvisioningTypes().then((response) => {
      this.provisioningTypes = response.data.list;
    });

    this.dictionaryService.getProvisioningDescriptions().then((response) => {
      this.provisioningDescriptions = response.data.list;
    });
  }

  ngOnDestroy(): void {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  onEdit(index: number) {
    this.dialogService.open(ProvisioningFormDialogComponent, {
      data: {
        contractIndex: this.id,
        index,
        state: this.provisionings[index],
        provisioningTypes: this.provisioningTypes,
        provisioningDescriptions: this.provisioningDescriptions,
      },
    });
  }

  onRemove(index: number) {
    this.store.dispatch(
      removeProvisioning({ contractIndex: this.id, provisioningIndex: index })
    );
  }

  onAdd() {
    if (this.isReadOnly) return;

    this.dialogService.open(ProvisioningFormDialogComponent, {
      data: {
        contractIndex: this.id,
        index: null,
        state: null,
        provisioningTypes: this.provisioningTypes,
        provisioningDescriptions: this.provisioningDescriptions,
      },
    });
  }
}
