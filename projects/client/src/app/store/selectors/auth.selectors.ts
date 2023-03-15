import { createSelector, Store, select } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { IOkapsAppState } from '../okaps';

const selectAuth = (state: IOkapsAppState) => state.auth;

const selectUser = createSelector(selectAuth, (auth) => auth.user);
const selectClaims = createSelector(selectAuth, (auth) => auth.claims);

const selectClaimsOnce = (store: Store<IOkapsAppState>) =>
  store.pipe(take(1), select(selectClaims));

export const okapsAuthSelectors = {
  selectAuth,
  selectUser,
  selectClaims,
  selectClaimsOnce,
};
