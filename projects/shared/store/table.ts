import { createAction, PayloadAction } from '@reduxjs/toolkit';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ITable, IPagination } from '../models/table';

export interface ITableState<T> extends ITable<T> {}

export const tableInitialState: ITableState<any> = {
  displayedColumns: [],
  sort: {
    column: null,
    direction: '',
  },
  totalItems: 0,
  pageIndex: 0,
  pageSize: 10,
  items: [],
};

export const pageChanged = (
  state: ITableState<any>,
  action: PayloadAction<PageEvent>
) => {
  const { pageSize, pageIndex } = action.payload;
  state.pageIndex = pageIndex;
  state.pageSize = pageSize;
};

export const sortChanged = (
  state: ITableState<any>,
  action: PayloadAction<Sort>
) => {
  const { active, direction } = action.payload;
  state.sort = {
    column: active,
    direction,
  };
};

export const tableLoaded = (
  state: ITable<any>,
  action: PayloadAction<ITable<any>>
) => {
  const { items, totalItems } = action.payload;
  state.items = items;
  state.totalItems = totalItems;
};

export const loadTable = (prefix: string) =>
  createAction<IPagination>(`${prefix}/loadTable`);
