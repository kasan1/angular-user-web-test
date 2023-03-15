import { createSelector } from '@ngrx/store';
import { cloneDeep } from 'lodash';
import { formatDate } from '@angular/common';
import { IOkapsAppState } from '../okaps';
import { IApplicationsState } from '../applications';

const selectApplications = (state: IOkapsAppState) => state.app;

export const selectApplicationFilter = createSelector(
  selectApplications,
  ({ pageIndex, pageSize, sort }) => ({ pageIndex, pageSize, ...sort })
);
export const selectApplicationTable = createSelector(
  selectApplications,
  (test: IApplicationsState) => {
    const clone = cloneDeep(test);
    // clone.items.forEach((i) => {
    //   i['formattedDate'] = formatDate(i.dateCreated, 'dd.MM.yy', 'en');
    // });

    clone.displayedColumns = [
      { accessor: 'number', columnName: 'Номер заявки' },
      { accessor: 'clientFullName', columnName: 'ФИО' },
      // { accessor: 'purpose', columnName: 'Цель' },
      {
        accessor: 'dateCreated',
        columnName: 'Дата',
        sortName: 'dateCreated',
      },
      {
        accessor: 'statusTitle',
        columnName: 'Статус',
      },
    ];

    return {
      ...clone,
    };
  }
);
