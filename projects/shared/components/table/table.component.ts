import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  ViewChild,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { get } from 'lodash';
import { MatSort, Sort } from '@angular/material/sort';
import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { ITable } from '../../models/table';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() table: ITable<any>;
  @Input() selectable = true;
  @Input() position = true;
  @Input() overflow = true;
  @Input() elevation = false;

  @Output() pageChange: EventEmitter<PageEvent> = new EventEmitter();
  @Output() sortChange: EventEmitter<Sort> = new EventEmitter();
  @Output() selectionChange: EventEmitter<any> = new EventEmitter();

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  _dataSource: MatTableDataSource<any>;
  _displayedColumns: string[];
  _ngDestroyed$ = new Subject();

  constructor() {}

  ngOnChanges(): void {
    this._renderTable();
    this._displayedColumns = [
      ...(this.position ? ['position'] : []),
      ...this.table.displayedColumns.map((x) => x.accessor),
    ];
  }

  ngOnInit(): void {
    this.sort.sortChange
      .pipe(
        takeUntil(this._ngDestroyed$),
        map((x) => this.sortChange.emit(x))
      )
      .subscribe();

    this.paginator.page
      .pipe(
        takeUntil(this._ngDestroyed$),
        map((x) => this.pageChange.emit(x))
      )
      .subscribe();
  }

  positionOf = (item: any) => {
    const { items, pageIndex, pageSize } = this.table;
    const index = items.findIndex((x) => x === item);
    return index > -1 ? index + 1 + pageIndex * pageSize : 0;
  };

  access = (item: any, accessor: string) => get(item, accessor);

  rowSelected = (item: any) => this.selectionChange.emit(item);

  _renderTable = () => {
    this._dataSource = new MatTableDataSource(this.table.items);
  };

  ngOnDestroy() {
    this._ngDestroyed$.next();
    this._ngDestroyed$.complete();
  }
}
