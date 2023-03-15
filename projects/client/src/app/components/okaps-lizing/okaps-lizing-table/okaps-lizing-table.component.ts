import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import {
  ILizingContract,
  ILizingTableValues,
  LizingFormDialogIProps,
} from '../../../models/lizing.model';
import { DictionariesService } from '../../../services/dictionaries.service';
import {
  removeAccessory,
  removeContract,
  updateAccessoryDictionaries,
} from '../../../store/lizing';
import { IOkapsAppState } from '../../../store/okaps';
import { OkapsLizingEditDialogComponent } from '../okaps-lizing-edit-dialog/okaps-lizing-edit-dialog.component';

@Component({
  selector: 'app-okaps-lizing-table',
  templateUrl: './okaps-lizing-table.component.html',
  styleUrls: ['./okaps-lizing-table.component.scss'],
})
export class OkapsLizingTableComponent implements OnInit, OnDestroy {
  @Input() id: string;
  @Input() maxPrice: number;
  @Input() isReadOnly: boolean = false;

  @ViewChild(MatSort) sort: MatSort;

  ngDestroyed$ = new Subject();

  dialogRef: MatDialogRef<OkapsLizingEditDialogComponent, any>;
  dataSource: MatTableDataSource<ILizingTableValues>;
  displayedColumns: string[] = [
    'position',
    'techProductName',
    'modelName',
    'manufacturerName',
    'supplierName',
    'price',
    'count',
    'actions',
  ];

  lizingContract: ILizingContract | null = null;

  constructor(
    private store: Store<IOkapsAppState>,
    private dialogService: MatDialog,
    private dictionaryService: DictionariesService
  ) {}

  ngOnInit(): void {
    this.store
      .pipe(
        select((state: IOkapsAppState) => state.lizing.contractsData[this.id]),
        map((contract) => {
          const data: ILizingTableValues[] = [];

          if (contract !== undefined) {
            this.lizingContract = contract;
            if (contract.productForm !== null) {
              data.push({
                techProductName: contract.productForm.techProduct.name,
                modelName: contract.productForm.model.name,
                manufacturerName: contract.productForm.manufacturer.name,
                supplierName: contract.productForm.supplier.name,
                price: contract.productForm.price,
                count: contract.productForm.count,
                isAccessory: false,
              });
            }
            for (let i = 0; i < contract.accessories.length; i++) {
              if (contract.accessories[i].accessoryForm !== null) {
                data.push({
                  techProductName:
                    contract.accessories[i].accessoryForm.techProduct.name,
                  modelName: contract.accessories[i].accessoryForm.model.name,
                  manufacturerName:
                    contract.accessories[i].accessoryForm.manufacturer.name,
                  supplierName:
                    contract.accessories[i].accessoryForm.supplier.name,
                  price: contract.accessories[i].accessoryForm.price,
                  count: contract.accessories[i].accessoryForm.count,
                  isAccessory: true,
                });
              }
            }
          }

          return data;
        })
      )
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

  onProductEdit() {
    if (this.dialogService.openDialogs.length === 0 && !this.isReadOnly) {
      this.dialogRef = this.dialogService.open(OkapsLizingEditDialogComponent, {
        data: <LizingFormDialogIProps>{
          id: this.id,
          maxPrice: this.maxPrice,
          accessoryIndex: null,
          formInitialValues: this.lizingContract.productForm,
        },
      });
    }
  }

  onAccessoryEdit(accessoryIndex: number) {
    if (this.dialogService.openDialogs.length === 0 && !this.isReadOnly) {
      this.dialogRef = this.dialogService.open(OkapsLizingEditDialogComponent, {
        data: <LizingFormDialogIProps>{
          id: this.id,
          maxPrice: this.maxPrice,
          accessoryIndex: accessoryIndex,
          formInitialValues:
            this.lizingContract.accessories[accessoryIndex].accessoryForm,
        },
      });
    }
  }

  onAccessoryAdd(accessoryIndex: number) {
    if (this.isReadOnly) return;

    this.dictionaryService
      .getTechProducts({
        accessoryId: '00000000-0000-0000-0000-000000000000',
      })
      .then((response) => {
        this.store.dispatch(
          updateAccessoryDictionaries({
            contractIndex: this.id,
            accessoryIndex: accessoryIndex,
            dictionaries: {
              ...this.lizingContract.accessories[accessoryIndex]
                .accessoryDictionaries,
              techProductsCollection: response.data.list,
            },
          })
        );

        if (this.dialogService.openDialogs.length === 0) {
          this.dialogService.open(OkapsLizingEditDialogComponent, {
            data: <LizingFormDialogIProps>{
              id: this.id,
              maxPrice: this.maxPrice,
              accessoryIndex: accessoryIndex,
              formInitialValues:
                this.lizingContract.accessories[accessoryIndex].accessoryForm,
            },
          });
        }
      });
  }

  onContractRemove() {
    this.store.dispatch(removeContract(this.id));
  }

  onAccessoryRemove(accessoryIndex: number) {
    this.store.dispatch(
      removeAccessory({ contractIndex: this.id, accessoryIndex })
    );
  }
}
