import { IBpmApplicationState } from './bpm-application.reducers';
import { MaritalStatus } from 'projects/shared/models/clientProfile';
import { holdingInitialState } from 'projects/shared/store/holding/holdingInitial';

export const bpmApplicationInitialState: IBpmApplicationState = {
  id: null,
  type: null,
  userId: null,
  loanProductId: null,
  loading: false,
  purpose: null,
  number: null,
  dateCreated: null,
  percent: null,

  withFood: false,
  projectDescription: null,
  purposeDescription: null,

  client: {
    fullName: null,
    age: null,
    maritalStatus: MaritalStatus.Single,
    iin: null,
    address: null,
    phone: null,
    additionPhone: null,
  },
  holdings: holdingInitialState,
  finAnalysis: null,
  chargees: null,

  files: {},
};
