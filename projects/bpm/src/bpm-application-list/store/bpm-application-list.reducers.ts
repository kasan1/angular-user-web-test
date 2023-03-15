import {
  ApplicationType,
  IApplicationEntry,
} from './../../../../shared/services/application.service';
import {
  ITableState,
  tableLoaded,
  pageChanged,
  sortChanged,
  tableInitialState,
} from 'projects/shared/store/table';
import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';
import { bpmAppListInitialState } from './bpmApplicationListInitial';
import { ITable, ISort, IPagination } from 'projects/shared/models/table';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { bpmApplicationInitialState } from '../../bpm-application/store/bpmApplicationInitial';

export interface IBpmApplicationsListState {
  loading: boolean;

  all: number; //Все заявки
  cmAll: number;
  cmNew: number;
  cmInWork: number;
  cmRework: number;
  cmReview: number;
  prepareCreditDossier: number;
  completed: number;
  cmArchive: number;

  urBoss: number;

  ePledge: number;
  eAct: number;

  urAll: number;
  urNew: number;
  urRework: number;
  ccNew: number;
  
  credAdminAll: number;
  credAdminCheck: number;

  current: ITableState<IApplicationEntry>;
}

export const loadBpmApplications = createAction<
  { type: ApplicationType; search?: string } & ISort & IPagination
>('bpmApplicationsList/loadBpmApplications');

export const loadBpmApplicationStatistics = createAction(
  'bpmApplicationsList/loadBpmApplictionStatistics'
);

const slice = createSlice({
  name: 'bpmApplicationsList',
  initialState: bpmAppListInitialState,
  reducers: {
    setBpmAppListLoading: (
      x: IBpmApplicationsListState,
      a: PayloadAction<boolean>
    ) => {
      x.loading = a.payload;
    },
    setBpmAppListPagination: (
      x: IBpmApplicationsListState,
      a: PayloadAction<IPagination>
    ) => {
      x.current.pageIndex = a.payload.pageIndex;
      x.current.pageSize = a.payload.pageSize;
    },
    bpmApplicationsLoaded: (
      x: IBpmApplicationsListState,
      a: PayloadAction<ITable<IApplicationEntry>>
    ) => {
      x.loading = false;
      if (a.payload) tableLoaded(x.current, a);
    },
    bpmApplicationStatisticsLoaded: (
      x: IBpmApplicationsListState,
      a: PayloadAction<Partial<IBpmApplicationsListState>>
    ) => {
      const {
        all,
        cmAll,
        cmArchive,
        cmInWork,
        cmNew,
        cmReview,
        cmRework,
        prepareCreditDossier,
        completed,
        urBoss,
        urAll,
        urNew,
        urRework,
        ccNew,
        ePledge,
        eAct,
        credAdminAll,
        credAdminCheck
      } = a.payload;
      x.loading = false;
      x.all = all;
      x.cmAll = cmAll;
      x.cmArchive = cmArchive;
      x.cmInWork = cmInWork;
      x.cmNew = cmNew;
      x.cmReview = cmReview;
      x.cmRework = cmRework;
      x.prepareCreditDossier = prepareCreditDossier;
      x.completed = completed;
      x.urAll = urAll;
      x.urNew = urNew;
      x.urBoss = urBoss;
      x.urRework = urRework;
      x.ccNew = ccNew;
      x.ePledge = ePledge;
      x.eAct = eAct;
      x.credAdminAll = credAdminAll;
      x.credAdminCheck = credAdminCheck;
    },
    bpmAppListPageChanged: (
      x: IBpmApplicationsListState,
      a: PayloadAction<PageEvent>
    ) => {
      pageChanged(x.current, a);
    },
    bpmAppListSortChanged: (
      x: IBpmApplicationsListState,
      a: PayloadAction<Sort>
    ) => {
      sortChanged(x.current, a);
    },
    clearBpmAppList: (x: IBpmApplicationsListState) => {
      Object.assign(x, bpmApplicationInitialState);
    },
  },
});

export const fromBpmAppList = {
  key: slice.name,
  reducer: slice.reducer,
};

export const {
  setBpmAppListLoading,
  setBpmAppListPagination,
  bpmAppListPageChanged,
  bpmAppListSortChanged,
  bpmApplicationsLoaded,
  bpmApplicationStatisticsLoaded,
  clearBpmAppList,
} = slice.actions;
export default slice.reducer;
