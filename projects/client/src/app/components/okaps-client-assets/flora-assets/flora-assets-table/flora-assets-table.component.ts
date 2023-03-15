import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { IFloraActivity } from 'projects/okaps/src/app/models/assets.model';
import { IDictionaryBase } from 'projects/okaps/src/app/models/common.model';
import { DictionariesService } from 'projects/okaps/src/app/services/dictionaries.service';
import { removeFloraAssets } from 'projects/okaps/src/app/store/assets';
import { IOkapsAppState } from 'projects/okaps/src/app/store/okaps';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FloraAssetsDialogFormComponent } from '../flora-assets-dialog-form/flora-assets-dialog-form.component';

@Component({
  selector: 'app-flora-assets-table',
  templateUrl: './flora-assets-table.component.html',
  styleUrls: ['./flora-assets-table.component.scss'],
})
export class FloraAssetsTableComponent implements OnInit {
  @Input() isReadOnly: boolean;
  @ViewChild(MatSort) sort: MatSort;

  ngDestroyed$ = new Subject();
  dataSource: MatTableDataSource<any>;
  floraAssets: IFloraActivity[] = [];

  cultures: IDictionaryBase[] = [];

  displayedColumns: string[] = [
    'culture',
    'plannedSquare',
    'seedingRate',
    'priceRealization',
    'cost',
    'productivityCurrentYear',
    'productivityLastYear',
    'productivityBeforeLastYear',
    'actions',
  ];

  constructor(
    private store: Store<IOkapsAppState>,
    private dictionaryService: DictionariesService,
    private dialogService: MatDialog
  ) {}

  ngOnInit(): void {
    this.store
      .select((state: IOkapsAppState) => state.assets.floraActivities)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((data) => {
        this.floraAssets = data;

        this.dataSource = new MatTableDataSource(data);
      });

    this.dictionaryService.getFloraCultures().then((response) => {
      this.cultures = response.data.list;
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
    return this.cultures.length > 0 && this.allowedCultures().length > 0;
  }

  allowedCultures(cultureIdToKeep: string = null): IDictionaryBase[] {
    return this.cultures.filter(
      (x) =>
        !this.floraAssets.some((xx) => xx.cultureId === x.id) ||
        (cultureIdToKeep && x.id === cultureIdToKeep)
    );
  }

  addFloraAssets() {
    if (this.isReadOnly) return;

    this.dialogService.open(FloraAssetsDialogFormComponent, {
      data: {
        initialData: null,
        cultures: this.allowedCultures(),
      },
    });
  }

  editFloraAssets(id: string) {
    if (this.isReadOnly) return;

    const asset = this.floraAssets.find((x) => x.id === id);
    this.dialogService.open(FloraAssetsDialogFormComponent, {
      data: {
        initialData: asset,
        cultures: this.allowedCultures(asset.cultureId),
      },
    });
  }

  removeFloraAssets(id: string) {
    if (this.isReadOnly) return;

    this.store.dispatch(removeFloraAssets(id));
  }
}
