import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map } from 'rxjs/operators';
import { PayloadAction } from '@reduxjs/toolkit';
import { ProductsService } from '../../services/products.service';
import { IPagination, ISort } from 'projects/shared/models/table';
import {
  loadApplicationsTable,
  applicationsTableLoaded,
} from '../applications';

@Injectable()
export class ApplicationsEffects {
  constructor(private actions$: Actions, private service: ProductsService) {}

  loadTable$ = createEffect(() =>
    this.actions$.pipe(
      ofType<PayloadAction<IPagination & ISort>>(loadApplicationsTable.type),
      switchMap(({ payload }) =>
        this.service
          .applicationsTable({ ...payload })
          .pipe(map((x) => applicationsTableLoaded({ ...x, ...payload })))
      )
    )
  );
}
