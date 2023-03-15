import { IBpmApplicationsListState } from './bpm-application-list.reducers';
import { tableInitialState } from 'projects/shared/store/table';

export const bpmAppListInitialState: IBpmApplicationsListState = {
  loading: false,

  all: 0,
  cmAll: 0,
  cmArchive: 0,
  cmNew: 0,
  cmInWork: 0,
  cmReview: 0,
  cmRework: 0,
  prepareCreditDossier: 0,
  completed: 0,


  urBoss: 0,
  ePledge: 0,
  eAct: 0,

  urAll: 0,
  urNew: 0,
  urRework: 0,
  ccNew: 0,

  credAdminAll: 0,
  credAdminCheck: 0,

  current: {
    ...tableInitialState,
  },
};
