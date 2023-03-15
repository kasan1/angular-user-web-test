import { createSelector, Store, select } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { IBpmAppState } from '../bpm';

const selectAuth = (state: IBpmAppState) => state.auth;

const selectUser = createSelector(selectAuth, (auth) => auth.user);

const selectUserOnce = (store: Store<IBpmAppState>) =>
  store.pipe(take(1), select(selectUser));

export const bpmAuthSelectors = {
  selectAuth,
  selectUser,
  selectUserOnce,
};
