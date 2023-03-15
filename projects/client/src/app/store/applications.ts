import {
  ITableState,
  loadTable,
  tableInitialState,
  tableLoaded,
  pageChanged,
  sortChanged,
} from 'projects/shared/store/table';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ITable } from 'projects/shared/models/table';
import { ILoanApplication } from '../models/application.model';

export interface IApplicationsState extends ITableState<ILoanApplication> {}

export const applicationsInitialState: IApplicationsState = {
  ...tableInitialState,
  pageSize: 20,
};

const slice = createSlice({
  name: 'applications',
  initialState: applicationsInitialState,
  reducers: {
    applicationsTableLoaded: (
      state: IApplicationsState,
      action: PayloadAction<ITable<ILoanApplication>>
    ) => tableLoaded(state, action),
    applicationsPageChanged: (
      state: IApplicationsState,
      action: PayloadAction<PageEvent>
    ) => pageChanged(state, action),
    applicationsSortChanged: (
      state: IApplicationsState,
      action: PayloadAction<Sort>
    ) => sortChanged(state, action),
  },
});

export default slice.reducer;
export const loadApplicationsTable = loadTable('applications');
export const {
  applicationsTableLoaded,
  applicationsPageChanged,
  applicationsSortChanged,
} = slice.actions;
