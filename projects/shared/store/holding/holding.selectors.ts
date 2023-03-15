import { formatCurrency } from './../../pipes/currency.pipe';
import { ISort } from './../../models/table';
import { IHoldingState, IHoldingEntry } from './holdingInitial';
import { createSelector } from '@ngrx/store';
import { ITable, IPagination } from 'projects/shared/models/table';
import { cloneDeep } from 'lodash';
import {
  PledgeFirstLevel,
  PledgeSecondLevel,
  PledgeThirdLevel,
} from 'projects/shared/services/pledge.service';

const holdings = (state: { holdings: IHoldingState }) => state.holdings;

export const selectHoldingsLoading = createSelector(holdings, (x) => x.loading);

export const selectHoldingsTable = createSelector(
  holdings,
  (x): ITable<IHoldingEntry> => {
    const { totalItems, pageIndex, pageSize, items, sort } = x;

    const clone = cloneDeep(items);
    clone.forEach((c) => {
      c['asonSumFormatted'] = formatCurrency(c.asonSum);
      c['nokSumFormatted'] = formatCurrency(c.nokSum);

      c.name = pledgeName(c.firstLevel, c.secondLevel, c.thirdLevel);

      if (!c.address) c.address = '-';

      c['addressFormatted'] = splitEvery(c.address, 2);
    });

    const displayedColumns = [
      { accessor: 'name', columnName: 'Наименование' },
      { accessor: 'addressFormatted', columnName: 'Адрес' },
      { accessor: 'asonSumFormatted', columnName: 'АСОН' },
      { accessor: 'nokSumFormatted', columnName: 'НОК' },
    ];

    return {
      items: clone,
      displayedColumns,
      pageIndex,
      pageSize,
      totalItems,
      sort,
    };
  }
);

export const selectHoldingsFilter = createSelector(holdings, (x): IPagination &
  ISort => {
  const { pageIndex, pageSize, sort } = x;
  return {
    pageSize,
    pageIndex,
    ...sort,
  };
});

export const pledgeName = (
  fl: PledgeFirstLevel,
  sl?: PledgeSecondLevel,
  tl?: PledgeThirdLevel
) => {
  switch (fl) {
    case PledgeFirstLevel.Nonmovable:
      if (sl == PledgeSecondLevel.Living) {
        if (tl == PledgeThirdLevel.Flat) return 'Недвижимость, Жилая, Квартира';
        else if (tl == PledgeThirdLevel.House)
          return 'Недвижимость, Жилая, Частный дом';
      } else if (sl == PledgeSecondLevel.Commercial)
        return 'Недвижимость, Коммерческая';
      else if (sl == PledgeSecondLevel.Land)
        return 'Недвижимость, Земельный участок';
      else return 'Не указано';

    case PledgeFirstLevel.Movable:
      if (sl == PledgeSecondLevel.Transport) {
        if (tl == PledgeThirdLevel.AutoTransport)
          return 'Движимое имущество, Транспорт, Автотранспорт';
        else if (tl == PledgeThirdLevel.LandTransport)
          return 'Движимое имущество, Транспорт, Сельхозтехника';
      } else if (sl == PledgeSecondLevel.Money)
        return 'Движимое имущество, Деньги';

    case PledgeFirstLevel.Guarantee:
      return 'Гарантия и поручительство';

    default:
      return 'Не указано';
  }
};

export const splitEvery = (text: string, x: number) =>
  text
    .split(' ')
    .map((value, index) =>
      index > 0 && index % x == 0 ? `${value}\n` : `${value} `
    )
    .join('');
