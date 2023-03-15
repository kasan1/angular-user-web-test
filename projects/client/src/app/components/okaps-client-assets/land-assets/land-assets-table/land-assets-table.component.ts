import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { ILandActivity } from 'projects/okaps/src/app/models/assets.model';
import { IDictionaryBase } from 'projects/okaps/src/app/models/common.model';
import { DictionariesService } from 'projects/okaps/src/app/services/dictionaries.service';
import { removeLandAssets } from 'projects/okaps/src/app/store/assets';
import { IOkapsAppState } from 'projects/okaps/src/app/store/okaps';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LandAssetsDialogFormComponent } from '../land-assets-dialog-form/land-assets-dialog-form.component';

@Component({
  selector: 'app-land-assets-table',
  templateUrl: './land-assets-table.component.html',
  styleUrls: ['./land-assets-table.component.scss'],
})
export class LandAssetsTableComponent implements OnInit, OnDestroy {
  @Input() isReadOnly: boolean;
  @ViewChild(MatSort) sort: MatSort;

  ngDestroyed$ = new Subject();
  dataSource: MatTableDataSource<ILandActivity>;
  landAssets: ILandActivity[] = [];

  landTypes: IDictionaryBase[] = [];
  ownershipTypes: IDictionaryBase[] = [];

  displayedColumns: string[] = [
    'landType',
    'square',
    'ownershipType',
    'actions',
  ];

  constructor(
    private store: Store<IOkapsAppState>,
    private dictionaryService: DictionariesService,
    private dialogService: MatDialog
  ) {}

  ngOnInit(): void {
    this.store
      .select((state: IOkapsAppState) => state.assets.landActivities)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((data) => {
        this.landAssets = data;
        this.dataSource = new MatTableDataSource(data);
      });

    this.dictionaryService.getLandTypes().then((response) => {
      this.landTypes = response.data.list;
    });
    this.dictionaryService.getOwnershipTypes().then((response) => {
      this.ownershipTypes = response.data.list;
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  get canAdd() {
    return (
      this.landTypes.length > 0 &&
      this.ownershipTypes.length > 0 &&
      this.allowedLandTypes().length > 0
    );
  }

  allowedLandTypes(landTypeIdToKeep: string = null): IDictionaryBase[] {
    return this.landTypes.filter(
      (x) =>
        !this.landAssets.some((xx) => xx.landTypeId === x.id) ||
        (landTypeIdToKeep && x.id === landTypeIdToKeep)
    );
  }

  addLandAssets() {
    if (this.isReadOnly) return;

    this.dialogService.open(LandAssetsDialogFormComponent, {
      data: {
        initialData: null,
        landTypes: this.allowedLandTypes(),
        ownershipTypes: this.ownershipTypes,
      },
    });
  }

  editLandAssets(id: string) {
    if (this.isReadOnly) return;

    const asset = this.landAssets.find((x) => x.id === id);
    this.dialogService.open(LandAssetsDialogFormComponent, {
      data: {
        initialData: asset,
        landTypes: this.allowedLandTypes(asset.landTypeId),
        ownershipTypes: this.ownershipTypes,
      },
    });
  }

  removeLandAssets(id: string) {
    if (this.isReadOnly) return;

    this.store.dispatch(removeLandAssets(id));
  }
}
