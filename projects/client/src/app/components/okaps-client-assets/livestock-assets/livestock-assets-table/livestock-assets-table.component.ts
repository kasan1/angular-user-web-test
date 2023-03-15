import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { ILivestockActivity } from 'projects/okaps/src/app/models/assets.model';
import { IDictionaryBase } from 'projects/okaps/src/app/models/common.model';
import { DictionariesService } from 'projects/okaps/src/app/services/dictionaries.service';
import { removeLiveStockAssets } from 'projects/okaps/src/app/store/assets';
import { IOkapsAppState } from 'projects/okaps/src/app/store/okaps';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LivestockAssetsDialogFormComponent } from '../livestock-assets-dialog-form/livestock-assets-dialog-form.component';

@Component({
  selector: 'app-livestock-assets-table',
  templateUrl: './livestock-assets-table.component.html',
  styleUrls: ['./livestock-assets-table.component.scss'],
})
export class LivestockAssetsTableComponent implements OnInit, OnDestroy {
  @Input() isReadOnly: boolean;
  @ViewChild(MatSort) sort: MatSort;

  ngDestroyed$ = new Subject();
  dataSource: MatTableDataSource<ILivestockActivity>;
  livestockAssets: ILivestockActivity[] = [];

  livestockTypes: IDictionaryBase[] = [];

  displayedColumns: string[] = [
    'livestockType',
    'count',
    'liveWeight',
    'slaughterWeight',
    'livePrice',
    'slaughterPrice',
    'actions',
  ];

  constructor(
    private store: Store<IOkapsAppState>,
    private dictionaryService: DictionariesService,
    private dialogService: MatDialog
  ) {}

  ngOnInit(): void {
    this.store
      .select((state: IOkapsAppState) => state.assets.livestockActivities)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((data) => {
        this.livestockAssets = data;
        this.dataSource = new MatTableDataSource(data);
      });

    this.dictionaryService.getLivestockTypes().then((response) => {
      this.livestockTypes = response.data.list;
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
      this.livestockTypes.length > 0 && this.allowedLivestockTypes().length > 0
    );
  }

  allowedLivestockTypes(
    livestockTypeIdToKeep: string = null
  ): IDictionaryBase[] {
    return this.livestockTypes.filter(
      (x) =>
        !this.livestockAssets.some((xx) => xx.livestockTypeId === x.id) ||
        (livestockTypeIdToKeep && x.id === livestockTypeIdToKeep)
    );
  }

  addLiveStockAssets() {
    if (this.isReadOnly) return;

    this.dialogService.open(LivestockAssetsDialogFormComponent, {
      data: {
        initialData: null,
        livestockTypes: this.allowedLivestockTypes(),
      },
    });
  }

  editLiveStockAssets(id: string) {
    if (this.isReadOnly) return;

    const asset = this.livestockAssets.find((x) => x.id === id);
    this.dialogService.open(LivestockAssetsDialogFormComponent, {
      data: {
        initialData: asset,
        livestockTypes: this.allowedLivestockTypes(asset.livestockTypeId),
      },
    });
  }

  removeLiveStockAssets(id: string) {
    if (this.isReadOnly) return;

    this.store.dispatch(removeLiveStockAssets(id));
  }
}
