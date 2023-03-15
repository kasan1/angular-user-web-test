import { ITable, IPagination, ISort } from './../../../../shared/models/table';
import { IBpmAppState } from '../../app/store/bpm';
import { createSelector } from '@ngrx/store';
import { formatDate } from '@angular/common';
import { cloneDeep } from 'lodash';

const bpmAppList = (state: IBpmAppState) => state.bpmApplicationsList;

export const selectBpmAppList = createSelector(bpmAppList, (x) => x);

export const selectBpmAppListFilter = createSelector(
  bpmAppList,
  (x): IPagination & ISort => ({
    pageIndex: x.current.pageIndex,
    pageSize: x.current.pageSize,
    ...x.current.sort,
  })
);

export const selectBpmAppListCurrent = createSelector(
  bpmAppList,
  (x): ITable<any> => {
    if (!x.current.items.length) return null;

    const clone = cloneDeep(x.current);

    clone.items.forEach((item) => {
      item['formattedDate'] = formatDate(item.dateCreated, 'dd.MM.yyyy', 'en');
    });

    clone.displayedColumns = [
      { accessor: 'number', columnName: '№ Заявки' },
      {
        accessor: 'formattedDate',
        columnName: 'Дата заявки',
        sortName: 'dateCreated',
      },
      { accessor: 'clientFullName', columnName: 'ФИО Клиента' },
      { accessor: 'purpose', columnName: 'Цель' },
      { accessor: 'iin', columnName: 'ИИН' },
    ];

    return clone;
  }
);

export const selectBpmAppListLoading = createSelector(
  bpmAppList,
  (x) => x.loading
);
