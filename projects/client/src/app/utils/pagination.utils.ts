import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Subject } from 'rxjs';

@Injectable()
export class CustomPaginatorIntl implements MatPaginatorIntl {
  changes = new Subject<void>();

  firstPageLabel = `Первая страница`;
  itemsPerPageLabel = `Элементов на странице:`;
  lastPageLabel = `Последняя страница`;

  nextPageLabel = 'Следующая страница';
  previousPageLabel = 'Предыдующая страница';

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return `Стр. 1 из 1`;
    }
    const amountPages = Math.ceil(length / pageSize);
    return `Стр. ${page + 1} из ${amountPages}`;
  }
}
