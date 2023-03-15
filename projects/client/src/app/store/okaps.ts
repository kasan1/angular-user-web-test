import { ActionReducerMap } from '@ngrx/store';
import authReducer, { IOkapsAuthState } from './auth';
import appReducer, { IApplicationsState } from './applications';
import lizingReducer from './lizing';
import clientReducer from './client';
import assetsReducer from './assets';
import clientExtraDetailsReducer from './client.extra';
import { enableMapSet } from 'immer';
import { ILizingState } from '../models/lizing.model';
import { IClientExtraDetails, IClientState } from '../models/client.model';
import { IAssets } from '../models/assets.model';

enableMapSet();

export interface IOkapsAppState {
  auth: IOkapsAuthState;
  app: IApplicationsState;
  lizing: ILizingState;
  client: IClientState;
  assets: IAssets;
  clientExtraDetails: IClientExtraDetails;
}

export const okapsReducers: ActionReducerMap<IOkapsAppState, any> = {
  auth: authReducer,
  app: appReducer,
  lizing: lizingReducer,
  client: clientReducer,
  assets: assetsReducer,
  clientExtraDetails: clientExtraDetailsReducer,
};

export const fromOkaps = {
  title: 'okaps',
  reducers: okapsReducers,
};
