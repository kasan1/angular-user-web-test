import { IPagination } from './../../../../shared/models/table';
import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';
import { bpmApplicationInitialState } from './bpmApplicationInitial';
import { MaritalStatus } from 'projects/shared/models/clientProfile';
import {
  IApplication,
  ApplicationType,
  IApplicationCondition,
} from 'projects/shared/services/application.service';
import {
  IHoldingState,
  IHoldingEntry,
} from 'projects/shared/store/holding/holdingInitial';
import { ITable, ISort } from 'projects/shared/models/table';
import { PageEvent } from '@angular/material/paginator';
import {
  tableLoaded,
  pageChanged,
  sortChanged,
} from 'projects/shared/store/table';
import { Sort } from '@angular/material/sort';
import {
  IBpmApplicationPurposeState,
  IBpmApplicationConditionState,
} from './extended/bpm-application-extended.reducers';
import { IDictionaryItem } from 'projects/shared/services/dictionary.service';
import {
  IChargee,
  ILiquiditySummary,
} from 'projects/shared/services/pledge.service';
import { IFinAnalysis } from 'projects/shared/services/finAnalysis.service';
import { IFileInfo, FilePage } from 'projects/shared/models/fileInfo';

export interface IBpmClient {
  fullName: string; //ФИО
  iin: string;
  age?: number;

  documentNumber?: string;
  documentBeginDate?: Date;
  documentEndDate?: Date;
  documentOrganizationName?: string;
  documentTypeName?: string;
  address: string; //Может иметь несколько адресов
  maritalStatus?: MaritalStatus;
  childrenCount?: number;
  imageUrl?: string; //Optional, либо url либо base64

  phone: string;
  additionPhone: string;

  companyNdc?: boolean;
  companyName?: string;
  companyAddress?: string;
  companyActivity?: string;
  companyRegisterDate?: Date;
  companyRegisterNumber?: string;
  companySerialNumber?: string;
  clientTypeId?: string;
  clientType?: string;
  filial?: string;
}

export interface IBpmApplicationState
  extends IBpmApplicationPurposeState,
    IBpmApplicationConditionState {
  id: string;
  userId: string;
  loanProductId: string;
  type: ApplicationType;
  loading: boolean;
  number: string; //NO Заявки
  dateCreated: Date; //Дата заявки
  purpose: string;
  client: IBpmClient; //Данные клиента
  percent: number;

  holdings: IHoldingState;
  finAnalysis?: IFinAnalysis;
  chargees?: IChargee[];

  files: {
    [key: number]: IFileInfo[];
  };

  liquiditySummary?: ILiquiditySummary;
}

export const loadBpmApplication = createAction<string>(
  'bpmApplication/loadBpmApplication'
);

export const loadBpmHoldings = createAction<
  ISort & IPagination & { applicationId: string }
>('bpmApplication/loadBpmHoldings');

export const loadBpmApplicationCondition = createAction<string>(
  'bpmApplication/loadBpmApplicationCondition'
);

export const loadBpmApplicationChargees = createAction<string>(
  'bpmApplication/loadBpmApplicationChargees'
);

export const loadBpmFinAnalysis = createAction<string>(
  'bpmApplication/loadBpmFinAnalysis'
);

export const loadBpmApplicationFiles = createAction<any>(
  'bpmApplication/loadBpmApplicationFiles'
);

export const loadBpmLiquiditySummary = createAction<string>(
  'bpmApplication/loadBpmLiquiditySummary'
);

const slice = createSlice({
  name: 'bpmApplication',
  initialState: bpmApplicationInitialState,
  reducers: {
    setBpmLiquiditySummary: (
      x: IBpmApplicationState,
      a: PayloadAction<ILiquiditySummary>
    ) => {
      x.liquiditySummary = a.payload;
    },
    setBpmApplicationFiles: (
      x: IBpmApplicationState,
      a: PayloadAction<{ page: FilePage; items: IFileInfo[] }>
    ) => {
      if (!a) return;

      const { page, items } = a.payload;
      x.files[page] = items;
    },
    deleteBpmApplicationFiles: (
      x: IBpmApplicationState,
      a: PayloadAction<{ page: FilePage; ids: string[] }>
    ) => {
      const { page, ids } = a.payload;

      if (!x.files[page] || !x.files[page].length) return;

      x.files[page] = x.files[page].filter((f) => ids.indexOf(f.id) == -1);
    },
    setBpmAppLoading: (x: IBpmApplicationState, a: PayloadAction<boolean>) => {
      x.loading = a.payload;
    },
    setBpmAppProductId: (
      x: IBpmApplicationState,
      a: PayloadAction<IDictionaryItem>
    ) => {
      const { id, code } = a.payload;
      x.loanProductId = id;

      x.amount = null;
      x.method = code == '1' ? 2 : null;
      x.duration = code == '1' ? 78 : null;
      x.paymentDay = null;
      x.paymentOd = code == '1' ? 4 : null;
      x.paymentPercent = code == '1' ? 3 : null;
      x.periodOd = code == '1' ? 24 : null;
      x.periodPercent = code == '1' ? 9 : null;
      x.transh = null;
      x.planId = null;
    },
    bpmApplicationClientChanged: (
      x: IBpmApplicationState,
      a: PayloadAction<IBpmClient>
    ) => {
      const { client: c } = x;

      c.documentBeginDate = a.payload.documentBeginDate;
      c.documentEndDate = a.payload.documentEndDate;
      c.documentTypeName = a.payload.documentTypeName;
      c.documentOrganizationName = a.payload.documentOrganizationName;
      c.documentNumber = a.payload.documentNumber;
      c.maritalStatus = a.payload.maritalStatus;
      c.childrenCount = a.payload.childrenCount;

      c.clientTypeId = a.payload.clientTypeId;
      c.clientType = a.payload.clientType;
      c.companySerialNumber = a.payload.companySerialNumber;
      c.companyActivity = a.payload.companyActivity;
      c.companyRegisterNumber = a.payload.companyRegisterNumber;
      c.companyRegisterDate = a.payload.companyRegisterDate;
      c.companyNdc = a.payload.companyNdc;
      c.companyName = a.payload.companyName;
      c.companyAddress = a.payload.companyAddress;

      x.percent = c.childrenCount >= 4 ? 4 : 6;
    },
    bpmApplicationLoaded: (
      x: IBpmApplicationState,
      a: PayloadAction<IApplication>
    ) => {
      if (!a.payload) return;

      const {
        maritalStatus,
        iin,
        fullName,
        age,
        registrationAddressRu,
        documentNumber,
        documentOrganizationName,
        documentBeginDate,
        documentEndDate,
        documentTypeName,
        childrenCount,
        clientTypeId,
        clientType,
        companyActivity,
        companyAddress,
        companyName,
        companyNdc,
        companyRegisterDate,
        companyRegisterNumber,
        companySerialNumber,
        filial,
        phone,
        additionPhone,
      } = a.payload.clientProfile;

      x.annualPayment = a.payload.annualPayment;

      x.client = {
        documentTypeName,
        documentBeginDate,
        documentEndDate,
        documentNumber,
        documentOrganizationName,
        maritalStatus,
        childrenCount,
        iin,
        fullName,
        age,
        address: registrationAddressRu,
        clientTypeId,
        clientType,
        filial,
        companyActivity,
        companyAddress,
        companyName,
        companyNdc,
        companyRegisterDate,
        companyRegisterNumber,
        companySerialNumber,
        additionPhone,
        phone,
      };

      const {
        number,
        dateCreated,
        type,
        userId,
        id,
        purpose,
        loanProductId,
        loanPurposeId,
        activityTypeId,
        projectDescription,
        purposeDescription,
        withFood,
      } = a.payload.application;
      x.id = id;
      x.userId = userId;
      x.type = type;
      x.loanProductId = loanProductId;
      x.number = number;
      x.purpose = purpose;
      x.dateCreated = dateCreated;

      x.loanPurposeId = loanPurposeId;
      x.activityTypeId = activityTypeId;
      x.purposeDescription = purposeDescription;
      x.projectDescription = projectDescription;
      x.withFood = withFood;

      x.percent = childrenCount >= 4 ? 4 : 6;

      x.loading = false;
    },
    updateBpmApplicationPurposeFields: (
      x: IBpmApplicationState,
      a: PayloadAction<Partial<IBpmApplicationState>>
    ) => {
      x.loanPurposeId = a.payload.loanPurposeId;

      x.purposeDescription = a.payload.purposeDescription;
      x.projectDescription = a.payload.projectDescription;
      x.purpose = a.payload.purpose;
      x.withFood = a.payload.withFood;

      if (x.activityTypeId != a.payload.activityTypeId)
        x.planId = a.payload.planId;

      x.activityTypeId = a.payload.activityTypeId;
    },
    clearBpmApplication: (x: IBpmApplicationState) => {
      Object.assign(x, bpmApplicationInitialState);
    },
    bpmSetHoldingLoading: (
      x: IBpmApplicationState,
      a: PayloadAction<boolean>
    ) => {
      x.holdings.loading = a.payload;
    },
    bpmHoldingsLoaded: (
      x: IBpmApplicationState,
      a: PayloadAction<ITable<IHoldingEntry>>
    ) => {
      if (a.payload) {
        x.holdings.loading = false;
        tableLoaded(x.holdings, a);
      }
    },
    bpmHoldingsPageChanged: (
      x: IBpmApplicationState,
      a: PayloadAction<PageEvent>
    ) => pageChanged(x.holdings, a),
    bpmHoldingsSortChanged: (x: IBpmApplicationState, a: PayloadAction<Sort>) =>
      sortChanged(x.holdings, a),
    bpmApplicationConditionLoaded: (
      x: IBpmApplicationState,
      a: PayloadAction<IApplicationCondition>
    ) => {
      if (!a) return;

      const {
        amount,
        method,
        duration,
        paymentDay,
        paymentOd,
        paymentPercent,
        periodOd,
        periodPercent,
        transh,
        planId,
      } = a.payload;

      x.amount = amount;
      x.method = method;
      x.duration = duration;
      x.paymentDay = paymentDay;
      x.paymentOd = paymentOd;
      x.paymentPercent = paymentPercent;
      x.periodOd = periodOd;
      x.periodPercent = periodPercent;
      x.transh = transh;
      x.planId = planId;
    },
    bpmApplicationChargeesLoaded: (
      x: IBpmApplicationState,
      a: PayloadAction<IChargee[]>
    ) => {
      x.chargees = a.payload;
    },
    bpmFinAnalysisLoaded: (
      x: IBpmApplicationState,
      a: PayloadAction<IFinAnalysis>
    ) => {
      x.finAnalysis = a.payload;

      if (x.finAnalysis)
        x.percent = x.client.childrenCount >= 4 || x.finAnalysis.isAsa ? 4 : 6;
    },
  },
});

export const fromBpmApp = {
  key: slice.name,
  reducer: slice.reducer,
};

export default slice.reducer;
export const {
  setBpmLiquiditySummary,
  setBpmApplicationFiles,
  deleteBpmApplicationFiles,
  setBpmAppLoading,
  setBpmAppProductId,
  bpmApplicationLoaded,
  bpmApplicationClientChanged,
  clearBpmApplication,
  updateBpmApplicationPurposeFields,
  bpmHoldingsLoaded,
  bpmHoldingsPageChanged,
  bpmHoldingsSortChanged,
  bpmSetHoldingLoading,
  bpmApplicationConditionLoaded,
  bpmApplicationChargeesLoaded,
  bpmFinAnalysisLoaded,
} = slice.actions;
