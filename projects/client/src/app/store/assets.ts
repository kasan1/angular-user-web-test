import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  IAssets,
  IFloraActivity,
  ILandActivity,
  ILivestockActivity,
  ITechnicActivity,
} from '../models/assets.model';
import { v4 } from 'uuid';

const initialState: IAssets = {
  id: null,
  landActivities: [],
  floraActivities: [],
  livestockActivities: [],
  technicActivities: [],
};

const assets = createSlice({
  name: 'assets',
  initialState: initialState,
  reducers: {
    setAssets: (state: IAssets, action: PayloadAction<IAssets>) => {
      state.id = action.payload.id;
      state.landActivities = action.payload.landActivities;
      state.floraActivities = action.payload.floraActivities;
      state.livestockActivities = action.payload.livestockActivities;
      state.technicActivities = action.payload.technicActivities;
    },
    clearAssets: (state: IAssets) => {
      state.id = null;
      state.landActivities = [];
      state.floraActivities = [];
      state.livestockActivities = [];
      state.technicActivities = [];
    },
    addLandAssets: (state: IAssets, action: PayloadAction<ILandActivity>) => {
      state.landActivities.push({ ...action.payload, id: v4() });
    },
    editLandAssets: (state: IAssets, action: PayloadAction<ILandActivity>) => {
      const index = state.landActivities.findIndex(
        (x) => x.id === action.payload.id
      );

      if (index !== -1) {
        state.landActivities = [
          ...state.landActivities.slice(0, index),
          action.payload,
          ...state.landActivities.slice(index + 1),
        ];
      }
    },
    removeLandAssets: (state: IAssets, action: PayloadAction<string>) => {
      state.landActivities = state.landActivities.filter(
        (x) => x.id !== action.payload
      );
    },
    addLiveStockAssets: (
      state: IAssets,
      action: PayloadAction<ILivestockActivity>
    ) => {
      state.livestockActivities.push({ ...action.payload, id: v4() });
    },
    editLiveStockAssets: (
      state: IAssets,
      action: PayloadAction<ILivestockActivity>
    ) => {
      const index = state.livestockActivities.findIndex(
        (x) => x.id === action.payload.id
      );

      if (index !== -1) {
        state.livestockActivities = [
          ...state.livestockActivities.slice(0, index),
          action.payload,
          ...state.livestockActivities.slice(index + 1),
        ];
      }
    },
    removeLiveStockAssets: (state: IAssets, action: PayloadAction<string>) => {
      state.livestockActivities = state.livestockActivities.filter(
        (x) => x.id !== action.payload
      );
    },
    addFloraAssets: (state: IAssets, action: PayloadAction<IFloraActivity>) => {
      state.floraActivities.push({ ...action.payload, id: v4() });
    },
    editFloraAssets: (
      state: IAssets,
      action: PayloadAction<IFloraActivity>
    ) => {
      const index = state.floraActivities.findIndex(
        (x) => x.id === action.payload.id
      );

      if (index !== -1) {
        state.floraActivities = [
          ...state.floraActivities.slice(0, index),
          action.payload,
          ...state.floraActivities.slice(index + 1),
        ];
      }
    },
    removeFloraAssets: (state: IAssets, action: PayloadAction<string>) => {
      state.floraActivities = state.floraActivities.filter(
        (x) => x.id !== action.payload
      );
    },
    addTechnicAssets: (
      state: IAssets,
      action: PayloadAction<ITechnicActivity>
    ) => {
      state.technicActivities.push({ ...action.payload, id: v4() });
    },
    editTechnicAssets: (
      state: IAssets,
      action: PayloadAction<ITechnicActivity>
    ) => {
      const index = state.technicActivities.findIndex(
        (x) => x.id === action.payload.id
      );

      if (index !== -1) {
        state.technicActivities = [
          ...state.technicActivities.slice(0, index),
          action.payload,
          ...state.technicActivities.slice(index + 1),
        ];
      }
    },
    removeTechnicAssets: (state: IAssets, action: PayloadAction<string>) => {
      state.technicActivities = state.technicActivities.filter(
        (x) => x.id !== action.payload
      );
    },
  },
});

const {
  setAssets,
  clearAssets,
  addLandAssets,
  editLandAssets,
  removeLandAssets,
  addLiveStockAssets,
  editLiveStockAssets,
  removeLiveStockAssets,
  addFloraAssets,
  editFloraAssets,
  removeFloraAssets,
  addTechnicAssets,
  editTechnicAssets,
  removeTechnicAssets,
} = assets.actions;

export {
  setAssets,
  clearAssets,
  addLandAssets,
  editLandAssets,
  removeLandAssets,
  addLiveStockAssets,
  editLiveStockAssets,
  removeLiveStockAssets,
  addFloraAssets,
  editFloraAssets,
  removeFloraAssets,
  addTechnicAssets,
  editTechnicAssets,
  removeTechnicAssets,
};

export default assets.reducer;
