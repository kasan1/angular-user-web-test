import { IBpmApplicationState } from './bpm-application.reducers';
import { IBpmAppState } from '../../app/store/bpm';
import { createSelector } from '@ngrx/store';
import { FilePage, IFileInfo } from 'projects/shared/models/fileInfo';

const bpmCM = (state: IBpmAppState) => state.bpmApplication;

export const selectBpmApp = createSelector(bpmCM, (x) => x);

export const selectBpmAppLoading = createSelector(
  selectBpmApp,
  (x) => x.loading
);

export const selectBpmAppProductId = createSelector(
  bpmCM,
  (x) => x.loanProductId
);

export const selectBpmFinAnalysis = createSelector(bpmCM, (x) => x.finAnalysis);

export const selectBpmAppFiles = createSelector(
  bpmCM,
  (x: IBpmApplicationState, page: FilePage): IFileInfo[] | null => x.files[page]
);

export const selectBpmLiquiditySummary = createSelector(
  bpmCM,
  (x) => x.liquiditySummary
);
