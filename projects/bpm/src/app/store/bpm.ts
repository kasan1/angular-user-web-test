import { ActionReducerMap } from '@ngrx/store';
import { IBpmAuthState } from './auth';
import authReducer from './auth';
import bpmAppReducer, {
  IBpmApplicationState,
} from '../../bpm-application/store/bpm-application.reducers';
import bpmAppListReducer, {
  IBpmApplicationsListState,
} from '../../bpm-application-list/store/bpm-application-list.reducers';

export interface IBpmAppState {
  auth: IBpmAuthState;

  bpmApplication?: IBpmApplicationState;
  bpmApplicationsList?: IBpmApplicationsListState;
}

export const bpmReducers: ActionReducerMap<IBpmAppState, any> = {
  auth: authReducer,

  bpmApplication: bpmAppReducer,
  bpmApplicationsList: bpmAppListReducer,
};
