import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  IAffiliatedOrganization,
  IClientDetails,
  IClientState,
  ICreditHistory,
  IOrganization,
  IPerson,
  IPersonality,
  IUpdateOrganizationDetails,
} from '../models/client.model';

const defaultSharedFields: IPersonality = {
  id: null,
  fullName: null,
  address: null,
  phone: null,
  fax: null,
  email: null,
  identifier: null,
  identificationDocument: null,
  region: null,
  workExperience: null,
};

export const defaultOrganisation: IOrganization = {
  ...defaultSharedFields,
  regionId: null,
  ownershipFormId: null,
  oked: [],
  registrationDocument: null,
  affiliatedOrganizations: [],
  creditHistory: [],
  bankAccounts: [],
  debts: [],
  isAffiliated: false,
  legalFormId: null,
  parent: null,
  shareInCapital: null,
  taxTreatmentId: null,
  subjectOfEntrepreneurId: null,
};

const defaultPerson: IPerson = {
  ...defaultSharedFields,
  birthDate: null,
  birthPlace: null,
  education: null,
  marriageStatusId: null,
  spouse: null,
  countryId: null,
};

const defaultClientDetails: IClientDetails = {
  id: null,
  isReadOnly: false,
  loanType: null,
  organization: defaultOrganisation,
  head: null,
  booker: null,
  beneficiary: null,
  representative: null,
  contacts: [],
};

const initialState: IClientState = {
  details: defaultClientDetails,
};

const client = createSlice({
  name: 'client',
  initialState: initialState,
  reducers: {
    setDetails: (
      state: IClientState,
      action: PayloadAction<IClientDetails>
    ) => {
      if (action.payload.id !== null) {
        state.details = action.payload;
      } else {
        state.details.loanType = action.payload.loanType;
      }
    },
    clearClientDetails: (state: IClientState) => {
      state.details = defaultClientDetails;
    },
    updateOrganisationDetails: (
      state: IClientState,
      action: PayloadAction<IUpdateOrganizationDetails>
    ) => {
      state.details.organization = {
        ...state.details.organization,
        ...action.payload.organization,
      };

      state.details.beneficiary = action.payload.beneficiary;
      state.details.representative = action.payload.representative;
      state.details.contacts = action.payload.contacts;
    },
    updateHead: (state: IClientState, action: PayloadAction<IPerson>) => {
      state.details.head = action.payload;
    },
    updateBooker: (state: IClientState, action: PayloadAction<IPerson>) => {
      state.details.booker = action.payload;
    },
    addCreditHistory: (
      state: IClientState,
      action: PayloadAction<ICreditHistory>
    ) => {
      state.details.organization.creditHistory.push({
        ...action.payload,
      });
    },
    editCreditHistory: (
      state: IClientState,
      action: PayloadAction<{ index: number; data: ICreditHistory }>
    ) => {
      state.details.organization.creditHistory = [
        ...state.details.organization.creditHistory.slice(
          0,
          action.payload.index
        ),
        action.payload.data,
        ...state.details.organization.creditHistory.slice(
          action.payload.index + 1
        ),
      ];
    },
    removeCreditHistory: (
      state: IClientState,
      action: PayloadAction<number>
    ) => {
      state.details.organization.creditHistory = [
        ...state.details.organization.creditHistory.slice(0, action.payload),
        ...state.details.organization.creditHistory.slice(action.payload + 1),
      ];
    },
    addAffilatedOrganisation: (
      state: IClientState,
      action: PayloadAction<IAffiliatedOrganization>
    ) => {
      state.details.organization.affiliatedOrganizations.push({
        ...action.payload,
      });
    },
    editAffilatedOrganisation: (
      state: IClientState,
      action: PayloadAction<{ index: number; data: IAffiliatedOrganization }>
    ) => {
      state.details.organization.affiliatedOrganizations = [
        ...state.details.organization.affiliatedOrganizations.slice(
          0,
          action.payload.index
        ),
        action.payload.data,
        ...state.details.organization.affiliatedOrganizations.slice(
          action.payload.index + 1
        ),
      ];
    },
    removeAffilatedOrganisation: (
      state: IClientState,
      action: PayloadAction<number>
    ) => {
      state.details.organization.affiliatedOrganizations = [
        ...state.details.organization.affiliatedOrganizations.slice(
          0,
          action.payload
        ),
        ...state.details.organization.affiliatedOrganizations.slice(
          action.payload + 1
        ),
      ];
    },
  },
});

const {
  setDetails,
  clearClientDetails,
  updateOrganisationDetails,
  updateHead,
  updateBooker,
  addCreditHistory,
  editCreditHistory,
  removeCreditHistory,
  addAffilatedOrganisation,
  editAffilatedOrganisation,
  removeAffilatedOrganisation,
} = client.actions;

export {
  setDetails,
  clearClientDetails,
  updateOrganisationDetails,
  updateHead,
  updateBooker,
  addCreditHistory,
  editCreditHistory,
  removeCreditHistory,
  addAffilatedOrganisation,
  editAffilatedOrganisation,
  removeAffilatedOrganisation,
};

export default client.reducer;
