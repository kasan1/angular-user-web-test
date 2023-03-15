import { ApplicationType } from './../../../../shared/services/application.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { BpmApplicationListService } from '../services/bpm-application-list.service';
import {
  loadBpmApplications,
  bpmApplicationsLoaded,
  bpmApplicationStatisticsLoaded,
  loadBpmApplicationStatistics,
} from './bpm-application-list.reducers';
import { switchMap, map, catchError } from 'rxjs/operators';
import { PayloadAction } from '@reduxjs/toolkit';
import { ISort, IPagination } from 'projects/shared/models/table';
import { of } from 'rxjs';

@Injectable()
export class BpmApplicationListEffects {
  constructor(
    private actions$: Actions,
    private service: BpmApplicationListService
  ) {}

  loadApplications$ = createEffect(() =>
    this.actions$.pipe(
      ofType<
        PayloadAction<
          { type: ApplicationType; search?: string } & ISort & IPagination
        >
      >(loadBpmApplications.type),
      switchMap((x) =>
        this.service.loadApplications(x.payload).pipe(
          map((r) => bpmApplicationsLoaded(r)),
          catchError(() => of(bpmApplicationsLoaded(null)))
        )
      )
    )
  );

  loadStatistics = createEffect(() =>
    this.actions$.pipe(
      ofType(loadBpmApplicationStatistics.type),
      switchMap(() =>
        this.service.loadStatistics().pipe(
          map((x) => bpmApplicationStatisticsLoaded(x)),
          catchError(() => of(bpmApplicationStatisticsLoaded({})))
        )
      )
    )
  );
}
