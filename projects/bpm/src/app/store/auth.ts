import { createSlice, createAction, PayloadAction } from '@reduxjs/toolkit';
import { IBpmUser } from '../models/bpm-user';
import { ILoginPayload, ILoggedInPayload } from './payloads/auth.payload';

export interface IBpmAuthState {
  user: IBpmUser;
  loading: boolean;
}

export const authInitialState: IBpmAuthState = {
  user: null,
  loading: false,
};

const login = createAction<ILoginPayload>('auth/login');
const logout = createAction('auth/logout');
const loadFromStorage = createAction('auth/loadFromStorage');

const auth = createSlice({
  name: 'auth',
  initialState: authInitialState,
  reducers: {
    loggingIn: (state: IBpmAuthState) => {
      state.loading = true;
    },
    loggedIn: (
      state: IBpmAuthState,
      action: PayloadAction<ILoggedInPayload>
    ) => {
      state.user = action.payload;
      state.loading = false;
    },
    loggedOut: (state: IBpmAuthState) => {
      state.user = null;
    },
    loginFailure: (state: IBpmAuthState) => {
      state.loading = false;
    },
  },
});

const { loggedIn, loggedOut, loginFailure, loggingIn } = auth.actions;

export default auth.reducer;
export const bpmAuthActions = {
  loggedIn,
  loggedOut,
  loginFailure,
  loggingIn,
  login,
  logout,
  loadFromStorage,
};
