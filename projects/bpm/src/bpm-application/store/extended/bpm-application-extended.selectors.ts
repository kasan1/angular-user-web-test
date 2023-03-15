import { splitEvery } from './../../../../../shared/store/holding/holding.selectors';
import {
  IChargee,
  PledgeThirdLevel,
} from './../../../../../shared/services/pledge.service';
import { selectBpmApp } from './../bpm-application.selectors';
import { createSelector } from '@ngrx/store';
import { ITable } from 'projects/shared/models/table';
import { formatDate } from '@angular/common';
import { formatCurrency } from 'projects/shared/pipes/currency.pipe';
import { cloneDeep, min } from 'lodash';
import {
  PledgeFirstLevel,
  PledgeSecondLevel,
} from 'projects/shared/services/pledge.service';
import { IBpmClient } from '../bpm-application.reducers';
import { pledgeName } from 'projects/shared/store/holding/holding.selectors';

const emptyFilters = {
  pageIndex: null,
  pageSize: null,
  sort: null,
  totalItems: null,
};

export const selectBpmAppConditionsTable = createSelector(
  selectBpmApp,
  (x): ITable<any> => {
    const { method, duration, paymentDay, percent } = x;

    const items = [
      {
        percentFormatted: percent ? `${percent} %` : 'Не указано',
        duration: duration || '-',
        method:
          method == 1
            ? 'Аннуитетный'
            : method == 2
            ? 'Дифференцированный'
            : '-',
        paymentDay: paymentDay || '-',
      },
    ];

    const displayedColumns = [
      { accessor: 'percentFormatted', columnName: 'Ставка' },
      { accessor: 'duration', columnName: 'Срок, мес' },
      { accessor: 'method', columnName: 'Метод погашения' },
      { accessor: 'paymentDay', columnName: 'Дата погашения' },
    ];

    return {
      ...emptyFilters,
      items,
      displayedColumns,
    };
  }
);

export const selectBpmAppPeriodTable = createSelector(
  selectBpmApp,
  (x): ITable<any> => {
    const { periodOd, periodPercent } = x;

    return {
      ...emptyFilters,
      items: [
        { periodOd: periodOd || '-', periodPercent: periodPercent || '-' },
      ],
      displayedColumns: [
        { accessor: 'periodOd', columnName: 'ОД, мес' },
        { accessor: 'periodPercent', columnName: '%, мес' },
      ],
    };
  }
);

export const selectBpmAppPaymentTable = createSelector(
  selectBpmApp,
  (x): ITable<any> => {
    const { paymentOd, paymentPercent } = x;

    const paymentOdFormatted =
      paymentOd == 1
        ? 'Ежемесячно'
        : paymentOd == 2
        ? 'Ежеквартально'
        : paymentOd == 3
        ? '1 раз в полгода'
        : paymentOd == 4
        ? '1 раз в год'
        : '-';

    const paymentPercentFormatted =
      paymentPercent == 1
        ? 'Ежемесячно'
        : paymentPercent == 2
        ? 'Ежеквартально'
        : paymentPercent == 3
        ? '1 раз в полгода'
        : paymentPercent == 4
        ? '1 раз в год'
        : '-';

    return {
      ...emptyFilters,
      items: [{ paymentOdFormatted, paymentPercentFormatted }],
      displayedColumns: [
        { accessor: 'paymentOdFormatted', columnName: 'ОД' },
        { accessor: 'paymentPercentFormatted', columnName: '%, мес' },
      ],
    };
  }
);

export const selectBpmAppPurposeTable = createSelector(
  selectBpmApp,
  (x): ITable<any> => {
    const { purpose, amount } = x;

    return {
      ...emptyFilters,
      items: [
        { purpose, amountFormatted: amount ? formatCurrency(amount) : '-' },
      ],
      displayedColumns: [
        { accessor: 'purpose', columnName: 'Цель займа' },
        { accessor: 'amountFormatted', columnName: 'Сумма' },
      ],
    };
  }
);

export const selectBpmAppHoldingsTable = createSelector(selectBpmApp, (x): {
  client: ITable<any>;
  name: ITable<any>;
  holding: ITable<any>;
  holding2: ITable<any>;
  nok: ITable<any>;
}[] => {
  const { holdings, chargees } = x;

  const result = [];

  const clone = cloneDeep(holdings.items);

  clone.forEach((item) => {
    const clients = chargees.filter((c) => c.basePledgeId == item.id);
    const clientsFormatted = clients.length
      ? clients.map((c) => clientInfo(c)).join('\n\n')
      : clientInfo(x.client);

    let nameFormatted = '';
    item['builtYearFormatted'] = item.builtYear || 'Не указано';
    item['livingAreaFormatted'] = item.livingArea || 'Не указано';
    item['landAreaFormatted'] = item.landArea || 'Не указано';
    item['totalAreaFormatted'] = item.totalArea || 'Не указано';
    item['cadastralNumberFormatted'] = item.cadastralNumber || 'Не указано';
    item['rentedForFormatted'] = item.rentedFor || 'Не указано';

    let type = '';
    if (
      item.firstLevel == PledgeFirstLevel.Nonmovable &&
      item.secondLevel == PledgeSecondLevel.Living &&
      (item.thirdLevel == PledgeThirdLevel.Flat ||
        item.thirdLevel == PledgeThirdLevel.House)
    ) {
      nameFormatted = `${pledgeName(
        item.firstLevel,
        item.secondLevel,
        item.thirdLevel
      )}\n${item.address}`;

      type = 'Living';
    } else if (
      item.firstLevel == PledgeFirstLevel.Nonmovable &&
      item.secondLevel == PledgeSecondLevel.Commercial
    ) {
      nameFormatted = `${pledgeName(
        item.firstLevel,
        item.secondLevel,
        item.thirdLevel
      )}, наименование: ${item.commercialName || 'Не указано'}\n${
        item.address
      }`;

      type = 'Commercial';
    } else if (
      item.firstLevel == PledgeFirstLevel.Nonmovable &&
      item.secondLevel == PledgeSecondLevel.Land
    ) {
      nameFormatted = `${pledgeName(
        item.firstLevel,
        item.secondLevel,
        item.thirdLevel
      )}, ${
        item.rent
          ? item.rent == 1
            ? 'Частная собственность'
            : 'Аренда'
          : 'Не указано'
      }\n${item.address}`;

      type = 'Land';
    } else if (
      item.firstLevel == PledgeFirstLevel.Movable &&
      item.secondLevel == PledgeSecondLevel.Transport &&
      item.thirdLevel == PledgeThirdLevel.AutoTransport
    ) {
      nameFormatted = `${pledgeName(
        item.firstLevel,
        item.secondLevel,
        item.thirdLevel
      )}`;

      type = 'Autotransport';

      item['yearFormatted'] = item.year || 'Не указано';
      item['govNumberFormatted'] = item.govNumber || 'Не указано';
      item['registerNumberFormatted'] = item.registerNumber || 'Не указано';
      item['registerDateFormatted'] = item.registerDate
        ? formatDate(item.registerDate, 'dd.MM.yyyy', 'en', 'UTC/GMT')
        : 'Не указано';
      item['markFormatted'] = item.mark || 'Не указано';
      item['colorFormatted'] = item.color || 'Не указано';
      item['countryFormatted'] = item.countryCode || 'Не указано';
      item['country2Formatted'] = item.countryCode || 'Не указано';
      item['vinFormatted'] = item.vin || 'Не указано';
    } else if (
      item.firstLevel == PledgeFirstLevel.Movable &&
      item.secondLevel == PledgeSecondLevel.Transport &&
      item.thirdLevel == PledgeThirdLevel.LandTransport
    ) {
      nameFormatted = `${pledgeName(
        item.firstLevel,
        item.secondLevel,
        item.thirdLevel
      )}`;

      item['yearFormatted'] = item.year || 'Не указано';
      item['markFormatted'] = item.mark || 'Не указано';
      item['countryFormatted'] = item.countryCode || 'Не указано';
      item['country2Formatted'] = item.countryCode || 'Не указано';

      type = 'Landtransport';
    }

    const minSum = min(
      [item.asonSum || 0, item.expertSum || 0].filter((x) => x)
    );

    item['asonSumFormatted'] =
      type == 'Living'
        ? formatCurrency(minSum || 0)
        : formatCurrency(item.expertSum || 0);
    item['nokSumFormatted'] = formatCurrency(item.nokSum || 0);

    result.push({
      client: {
        ...emptyFilters,
        items: [{ clientsFormatted }],
        displayedColumns: [
          { accessor: 'clientsFormatted', columnName: 'Залогодатель' },
        ],
      },
      name: {
        ...emptyFilters,
        items: [{ nameFormatted }],
        displayedColumns: [
          { accessor: 'nameFormatted', columnName: 'Наименование и Адрес' },
        ],
      },
      holding: {
        ...emptyFilters,
        items: [item],
        displayedColumns: [
          ...(type == 'Living' || type == 'Commercial'
            ? [{ accessor: 'totalAreaFormatted', columnName: 'Общая' }]
            : []),
          ...(type == 'Living'
            ? [{ accessor: 'livingAreaFormatted', columnName: 'Жилая' }]
            : []),
          ...(type == 'Living' || type == 'Commercial'
            ? [{ accessor: 'builtYearFormatted', columnName: 'Год постройки' }]
            : []),

          ...(type == 'Commercial' || type == 'Land'
            ? [
                {
                  accessor: 'landAreaFormatted',
                  columnName: 'Площадь зем. участка',
                },
              ]
            : []),
          ...(type == 'Land' && item.rent == 2
            ? [
                {
                  accessor: 'rentedForFormatted',
                  columnName: 'Срок аренды',
                },
              ]
            : []),
          ...(type == 'Living' || type == 'Commercial' || type == 'Land'
            ? [
                {
                  accessor: 'cadastralNumberFormatted',
                  columnName: 'Кадастровый номер',
                },
              ]
            : []),
          ...(type == 'Autotransport'
            ? [
                { accessor: 'yearFormatted', columnName: 'Год выпуска' },
                { accessor: 'govNumberFormatted', columnName: 'Гос номер' },
                {
                  accessor: 'registerNumberFormatted',
                  columnName: '№ Св-ва о гос регистрации',
                },
                {
                  accessor: 'registerDateFormatted',
                  columnName: 'Дата св-ва о гос регистрации',
                },
              ]
            : []),
          ...(type == 'Landtransport'
            ? [
                { accessor: 'yearFormatted', columnName: 'Год выпуска' },
                { accessor: 'markFormatted', columnName: 'Марка' },
                { accessor: 'countryFormatted', columnName: 'Производитель' },
                {
                  accessor: 'country2Formatted',
                  columnName: 'Страна производства',
                },
              ]
            : []),
        ],
      },
      holding2:
        type == 'Autotransport'
          ? {
              ...emptyFilters,
              items: [item],
              displayedColumns: [
                { accessor: 'vinFormatted', columnName: 'VIN' },
                { accessor: 'markFormatted', columnName: 'Марка' },
                { accessor: 'colorFormatted', columnName: 'Цвет' },
                { accessor: 'countryFormatted', columnName: 'Производитель' },
                {
                  accessor: 'country2Formatted',
                  columnName: 'Страна производства',
                },
              ],
            }
          : null,
      nok: {
        ...emptyFilters,
        items: [item],
        displayedColumns: [
          { accessor: 'nokSumFormatted', columnName: 'НОК' },
          {
            accessor: 'asonSumFormatted',
            columnName: type == 'Living' ? 'АСОН/Экспертная' : 'Экспертная',
          },
          { accessor: 'coefficient', columnName: 'LTV' },
        ],
      },
    });
  });

  return result;
});

export const clientInfo = (c: IBpmClient | IChargee) =>
  `${c.fullName || '-'}\nИИН ${c.iin || '-'}\nУД. личности: ${
    c.documentNumber || '-'
  }, ${
    c.documentBeginDate
      ? formatDate(c.documentBeginDate, 'dd.MM.yyyy', 'en', 'UTC/GMT')
      : 'Не указано'
  } - ${
    c.documentEndDate
      ? formatDate(c.documentEndDate, 'dd.MM.yyyy', 'en', 'UTC/GMT')
      : 'Не указано'
  }\n${c.documentOrganizationName || '-'}`;
