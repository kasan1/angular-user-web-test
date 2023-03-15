import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  IClientExtraDetails,
  IDocument,
  IFLOwner,
  IOrganizationLicense,
  IULOwner,
} from '../models/client.model';

import { v4 } from 'uuid';

const initialState: IClientExtraDetails = {
  id: null,
  isReadOnly: false,
  flOwners: [],
  ulOwners: [],
  licenses: [],
  vatCertificate: null,
};

const clientExtraDetails = createSlice({
  name: 'clientExtraDetails',
  initialState: initialState,
  reducers: {
    setClientExtraDetails: (
      state: IClientExtraDetails,
      action: PayloadAction<IClientExtraDetails>
    ) => {
      state.id = action.payload.id;
      state.isReadOnly = action.payload.isReadOnly;
      state.flOwners = action.payload.flOwners;
      state.ulOwners = action.payload.ulOwners;
      state.licenses = action.payload.licenses;
      state.vatCertificate = action.payload.vatCertificate;
    },
    clearClientExtraDetails: (state: IClientExtraDetails) => {
      state.id = null;
      state.isReadOnly = false;
      state.flOwners = [];
      state.ulOwners = [];
      state.licenses = [];
      state.vatCertificate = null;
    },
    addUlOwner: (
      state: IClientExtraDetails,
      action: PayloadAction<IULOwner>
    ) => {
      state.ulOwners.push(action.payload);
    },
    editUlOwner: (
      state: IClientExtraDetails,
      action: PayloadAction<{ index: number; data: IULOwner }>
    ) => {
      if (action.payload.index !== -1) {
        state.ulOwners = [
          ...state.ulOwners.slice(0, action.payload.index),
          action.payload.data,
          ...state.ulOwners.slice(action.payload.index + 1),
        ];
      }
    },
    removeUlOwner: (
      state: IClientExtraDetails,
      action: PayloadAction<number>
    ) => {
      state.ulOwners.splice(action.payload, 1);
    },
    addFlOwner: (
      state: IClientExtraDetails,
      action: PayloadAction<IFLOwner>
    ) => {
      state.flOwners.push(action.payload);
    },
    editFlOwner: (
      state: IClientExtraDetails,
      action: PayloadAction<{ index: number; data: IFLOwner }>
    ) => {
      if (action.payload.index !== -1) {
        state.flOwners = [
          ...state.flOwners.slice(0, action.payload.index),
          action.payload.data,
          ...state.flOwners.slice(action.payload.index + 1),
        ];
      }
    },
    removeFlOwner: (
      state: IClientExtraDetails,
      action: PayloadAction<number>
    ) => {
      state.flOwners.splice(action.payload, 1);
    },
    addLicense: (
      state: IClientExtraDetails,
      action: PayloadAction<IOrganizationLicense>
    ) => {
      state.licenses.push(action.payload);
    },
    editLicense: (
      state: IClientExtraDetails,
      action: PayloadAction<{ index: number; data: IOrganizationLicense }>
    ) => {
      if (action.payload.index !== -1) {
        state.licenses = [
          ...state.licenses.slice(0, action.payload.index),
          action.payload.data,
          ...state.licenses.slice(action.payload.index + 1),
        ];
      }
    },
    removeLicense: (
      state: IClientExtraDetails,
      action: PayloadAction<number>
    ) => {
      state.licenses.splice(action.payload, 1);
    },
    addCertificate: (
      state: IClientExtraDetails,
      action: PayloadAction<IDocument>
    ) => {
      state.vatCertificate = action.payload;
    },
    editCertificate: (
      state: IClientExtraDetails,
      action: PayloadAction<IDocument>
    ) => {
      state.vatCertificate.number = action.payload.number;
      state.vatCertificate.issuer = action.payload.issuer;
      state.vatCertificate.dateIssue = action.payload.dateIssue;
    },
    removeCertificate: (state: IClientExtraDetails) => {
      state.vatCertificate = null;
    },
  },
});

const {
  setClientExtraDetails,
  clearClientExtraDetails,
  addUlOwner,
  editUlOwner,
  removeUlOwner,
  addFlOwner,
  editFlOwner,
  removeFlOwner,
  addLicense,
  editLicense,
  removeLicense,
  addCertificate,
  editCertificate,
  removeCertificate,
} = clientExtraDetails.actions;

export {
  setClientExtraDetails,
  clearClientExtraDetails,
  addUlOwner,
  editUlOwner,
  removeUlOwner,
  addFlOwner,
  editFlOwner,
  removeFlOwner,
  addLicense,
  editLicense,
  removeLicense,
  addCertificate,
  editCertificate,
  removeCertificate,
};

export default clientExtraDetails.reducer;
