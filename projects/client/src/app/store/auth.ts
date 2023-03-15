import { createSlice, createAction, PayloadAction } from '@reduxjs/toolkit';
import { IOkapsUser, ITokenClaims } from '../models/user.model';
import { ILoginPayload, ILoggedInPayload } from './payloads/auth.payload';

export interface IOkapsAuthState {
  user: IOkapsUser;
  claims: ITokenClaims;
  loading: boolean;
}

export const authInitialState: IOkapsAuthState = {
  user: null,
  claims: null,
  loading: false,
};

const login = createAction<ILoginPayload>('auth/login');
const logout = createAction('auth/logout');
const loadFromStorage = createAction('auth/loadFromStorage');
const loadProfile = createAction<ITokenClaims>('auth/loadProfile');

const auth = createSlice({
  name: 'auth',
  initialState: authInitialState,
  reducers: {
    loggingIn: (state: IOkapsAuthState) => {
      state.loading = true;
    },
    loggedIn: (state: IOkapsAuthState, action: PayloadAction<ITokenClaims>) => {
      state.claims = action.payload;
    },
    loggedOut: (state: IOkapsAuthState) => {
      state.claims = null;
      state.user = null;
    },
    loginFailure: (state: IOkapsAuthState) => {
      state.loading = false;
    },
    setProfile: (state: IOkapsAuthState, action: PayloadAction<IOkapsUser>) => {
      state.user = action.payload;
      state.loading = false;
    },
  },
});

const { loggedIn, loggedOut, loginFailure, loggingIn, setProfile } =
  auth.actions;

export default auth.reducer;
export const okapsAuthActions = {
  loggedIn,
  loggedOut,
  loginFailure,
  loggingIn,
  login,
  logout,
  loadFromStorage,
  setProfile,
  loadProfile,
};
