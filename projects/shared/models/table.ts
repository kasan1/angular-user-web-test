import { Observable } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { Sort, SortDirection } from '@angular/material/sort';

export interface ITable<T> extends IPagination {
  totalItems: number;
  items: T[];
  sort: ISort;

  displayedColumns: IColumn[];
}

export interface IPagination {
  pageIndex: number;
  pageSize: number;
}

export interface ISort {
  column: string;
  direction: SortDirection;
}

export interface IColumn {
  accessor: string;
  columnName: string;
  sortName?: string;
}

export const toQueryString = (x: IPagination & ISort) =>
  `?pageIndex=${x.pageIndex}&pageSize=${x.pageSize}&column=${column(
    x
  )}&direction=${direction(x)}`;

const column = (x: IPagination & ISort) =>
  x.column ? x.column[0].toUpperCase() + x.column.substr(1) : 'Id';
const direction = (x: IPagination & ISort) => x.direction || 'asc';

export class TableFunctionality<T> {
  table$: Observable<ITable<T>>;

  handlePageChange = (event: PageEvent) => {};

  handleSortChange = (event: Sort) => {};

  handleSelectionChange = (event: any) => {}; //item
}
