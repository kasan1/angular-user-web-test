import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  loadBpmApplication,
  bpmApplicationLoaded,
  loadBpmHoldings,
  bpmHoldingsLoaded,
  loadBpmApplicationCondition,
  bpmApplicationConditionLoaded,
  loadBpmApplicationChargees,
  bpmApplicationChargeesLoaded,
  loadBpmFinAnalysis,
  bpmFinAnalysisLoaded,
  loadBpmApplicationFiles,
  setBpmApplicationFiles,
  loadBpmLiquiditySummary,
  setBpmLiquiditySummary,
} from './bpm-application.reducers';
import { PayloadAction } from '@reduxjs/toolkit';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { BpmApplicationService } from '../services/bpm-application.service';
import { BpmPledgeService } from '../services/bpm-pledge.service';
import { ISort, IPagination } from 'projects/shared/models/table';
import { BpmFinAnalysisService } from '../services/bpm-finAnalysis.service';
import { IFileFilter } from 'projects/shared/services/file.service';
import { BpmFileService } from '../../app/services/bpm-file.service';

@Injectable()
export class BpmApplicationEffects {
  constructor(
    private actions$: Actions,
    private file: BpmFileService,
    private service: BpmApplicationService,
    private pledgeService: BpmPledgeService,
    private finAnalysisService: BpmFinAnalysisService
  ) {}

  loadClientProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType<PayloadAction<string>>(loadBpmApplication.type),
      switchMap((x) =>
        this.service.application(x.payload).pipe(
          map(bpmApplicationLoaded),
          catchError(() => of(bpmApplicationLoaded(null)))
        )
      )
    )
  );

  loadHoldings$ = createEffect(() =>
    this.actions$.pipe(
      ofType<PayloadAction<ISort & IPagination & { applicationId: string }>>(
        loadBpmHoldings.type
      ),
      switchMap((x) =>
        this.pledgeService.loadPledges(x.payload).pipe(
          map((r) => bpmHoldingsLoaded(r)),
          catchError(() => of(bpmHoldingsLoaded(null)))
        )
      )
    )
  );

  loadLiquiditySummary = createEffect(() =>
    this.actions$.pipe(
      ofType<PayloadAction<string>>(loadBpmLiquiditySummary.type),
      switchMap((x) =>
        this.pledgeService.liquiditySummary(x.payload).pipe(
          map((r) => setBpmLiquiditySummary(r)),
          catchError(() => of(setBpmLiquiditySummary(null)))
        )
      )
    )
  );

  loadConditions$ = createEffect(() =>
    this.actions$.pipe(
      ofType<PayloadAction<string>>(loadBpmApplicationCondition.type),
      switchMap((x) =>
        this.service.loanCondition(x.payload).pipe(
          map((r) => bpmApplicationConditionLoaded(r)),
          catchError(() => of(bpmApplicationConditionLoaded(null)))
        )
      )
    )
  );

  loadChargees$ = createEffect(() =>
    this.actions$.pipe(
      ofType<PayloadAction<string>>(loadBpmApplicationChargees.type),
      switchMap((x) =>
        this.pledgeService.chargeesByAppId(x.payload).pipe(
          map((r) => bpmApplicationChargeesLoaded(r)),
          catchError(() => of(bpmApplicationChargeesLoaded([])))
        )
      )
    )
  );

  loadFinAnalysis$ = createEffect(() =>
    this.actions$.pipe(
      ofType<PayloadAction<string>>(loadBpmFinAnalysis.type),
      switchMap((x) =>
        this.finAnalysisService.finAnalysisResult(x.payload).pipe(
          map((r) => bpmFinAnalysisLoaded(r)),
          catchError(() => of(bpmFinAnalysisLoaded(null)))
        )
      )
    )
  );

  loadFiles$ = createEffect(() =>
    this.actions$.pipe(
      ofType<PayloadAction<IFileFilter>>(loadBpmApplicationFiles.type),
      switchMap((x) =>
        this.file.load(x.payload).pipe(
          map((r) =>
            setBpmApplicationFiles({ page: x.payload.page, items: r })
          ),
          catchError(() => of(setBpmApplicationFiles(null)))
        )
      )
    )
  );
}
