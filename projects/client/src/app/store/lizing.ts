import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 } from 'uuid';
import {
  ILizingState,
  ILizingContract,
  ICalculatorResult,
  IProductFormState,
  IProductDictinaries,
  IProvisioning,
} from '../models/lizing.model';

const dictionariesDefaulState: IProductDictinaries = {
  techTypesCollection: [],
  techSubtypesCollection: [],
  techProductsCollection: [],
  modelsCollection: [],
  manufacturersCollection: [],
  suppliersCollection: [],
};

const contractsDefaultState: ILizingContract = {
  permanent: false,
  productForm: null,
  productDictionaries: dictionariesDefaulState,
  accessories: [
    {
      accessoryForm: null,
      accessoryDictionaries: dictionariesDefaulState,
    },
  ],
  calculatorResult: null,
  calculatorForm: {
    coFinancing: 20,
    period: 3,
  },
  hasProvisions: false,
  provisions: [],
};

const id = v4();

export const lizingInitialState: ILizingState = {
  contracts: [id],
  contractsData: { [id]: contractsDefaultState },
  submitted: false,
  persistant: false,
};

const lizing = createSlice({
  name: 'lizing',
  initialState: lizingInitialState,
  reducers: {
    updateState: (state: ILizingState, action: PayloadAction<ILizingState>) => {
      state.applicationId = action.payload.applicationId;
      state.contracts = action.payload.contracts;
      state.contractsData = action.payload.contractsData;
      state.submitted = action.payload.submitted;
      state.persistant = action.payload.persistant;
    },
    setSubmitted: (state: ILizingState) => {
      state.submitted = true;
    },
    addContract: (state: ILizingState) => {
      let contractId = v4();

      state.contracts.push(contractId);
      state.contractsData[contractId] = contractsDefaultState;
    },
    removeContract: (state: ILizingState, action: PayloadAction<string>) => {
      state.contracts = state.contracts.filter((x) => x !== action.payload);
      delete state.contractsData[action.payload];

      if (state.contracts.length === 0) {
        const contractId = v4();

        state.contracts.push(contractId);
        state.contractsData[contractId] = contractsDefaultState;
      }
    },
    clearAllContracts(state: ILizingState) {
      const contractId = v4();

      state.contracts.splice(0);
      Object.keys(state.contractsData).forEach((key) => {
        delete state.contractsData[key];
      });

      delete state.applicationId;
      state.contracts.push(contractId);
      state.contractsData[contractId] = contractsDefaultState;
      state.submitted = false;
      state.persistant = false;
    },
    updateProductDictionaries: (
      state: ILizingState,
      action: PayloadAction<{
        contractIndex: string;
        dictionaries: IProductDictinaries;
      }>
    ) => {
      state.contractsData[action.payload.contractIndex].productDictionaries =
        action.payload.dictionaries;
    },
    addOrUpdateProductForm: (
      state: ILizingState,
      action: PayloadAction<{
        contractIndex: string;
        form: IProductFormState;
      }>
    ) => {
      state.contractsData[action.payload.contractIndex].productForm =
        action.payload.form;
    },
    updateAccessoryDictionaries: (
      state: ILizingState,
      action: PayloadAction<{
        contractIndex: string;
        accessoryIndex: number;
        dictionaries: IProductDictinaries;
      }>
    ) => {
      state.contractsData[action.payload.contractIndex].accessories[
        action.payload.accessoryIndex
      ].accessoryDictionaries = action.payload.dictionaries;
    },
    addOrUpdateAccessoryForm: (
      state: ILizingState,
      action: PayloadAction<{
        contractIndex: string;
        accessoryIndex: number;
        form: IProductFormState;
      }>
    ) => {
      if (
        state.contractsData[action.payload.contractIndex].accessories.length -
          1 ===
        action.payload.accessoryIndex
      ) {
        state.contractsData[action.payload.contractIndex].accessories.push({
          accessoryForm: null,
          accessoryDictionaries: dictionariesDefaulState,
        });
      }

      state.contractsData[action.payload.contractIndex].accessories[
        action.payload.accessoryIndex
      ].accessoryForm = action.payload.form;
    },
    removeAccessory: (
      state: ILizingState,
      action: PayloadAction<{ contractIndex: string; accessoryIndex: number }>
    ) => {
      state.contractsData[action.payload.contractIndex].accessories.splice(
        action.payload.accessoryIndex,
        1
      );

      if (
        state.contractsData[action.payload.contractIndex].accessories.length ===
        0
      ) {
        state.contractsData[action.payload.contractIndex].accessories.push({
          accessoryForm: null,
          accessoryDictionaries: dictionariesDefaulState,
        });
      }
    },
    setCalculatorResult: (
      state: ILizingState,
      action: PayloadAction<{ contractIndex: string; data: ICalculatorResult }>
    ) => {
      state.contractsData[action.payload.contractIndex].calculatorResult =
        action.payload.data;
    },
    setCalculatorPeriod: (
      state: ILizingState,
      action: PayloadAction<{ contractIndex: string; period: number }>
    ) => {
      state.contractsData[action.payload.contractIndex].calculatorForm.period =
        action.payload.period;
    },
    setCalculatorCoFinancing: (
      state: ILizingState,
      action: PayloadAction<{ contractIndex: string; coFinancing: number }>
    ) => {
      state.contractsData[
        action.payload.contractIndex
      ].calculatorForm.coFinancing = action.payload.coFinancing;
    },
    addProvisioning: (
      state: ILizingState,
      action: PayloadAction<{ contractIndex: string; data: IProvisioning }>
    ) => {
      state.contractsData[action.payload.contractIndex].provisions.push(
        action.payload.data
      );
    },
    editProvisioning: (
      state: ILizingState,
      action: PayloadAction<{
        contractIndex: string;
        provisioningIndex: number;
        data: IProvisioning;
      }>
    ) => {
      state.contractsData[action.payload.contractIndex].provisions[
        action.payload.provisioningIndex
      ] = action.payload.data;
    },
    removeProvisioning: (
      state: ILizingState,
      action: PayloadAction<{
        contractIndex: string;
        provisioningIndex: number;
      }>
    ) => {
      state.contractsData[action.payload.contractIndex].provisions.splice(
        action.payload.provisioningIndex,
        1
      );
    },
    setHasProvisioning: (
      state: ILizingState,
      action: PayloadAction<{
        contractId: string;
        hasProvisioning: boolean;
      }>
    ) => {
      state.contractsData[action.payload.contractId].hasProvisions =
        action.payload.hasProvisioning;
    },
  },
});

const {
  updateState,
  setSubmitted,
  addContract,
  removeContract,
  clearAllContracts,
  addOrUpdateProductForm,
  updateProductDictionaries,
  updateAccessoryDictionaries,
  addOrUpdateAccessoryForm,
  removeAccessory,
  setCalculatorResult,
  setCalculatorPeriod,
  setCalculatorCoFinancing,
  addProvisioning,
  editProvisioning,
  removeProvisioning,
  setHasProvisioning,
} = lizing.actions;

export {
  updateState,
  setSubmitted,
  addContract,
  removeContract,
  clearAllContracts,
  addOrUpdateProductForm,
  updateProductDictionaries,
  updateAccessoryDictionaries,
  addOrUpdateAccessoryForm,
  removeAccessory,
  setCalculatorResult,
  setCalculatorPeriod,
  setCalculatorCoFinancing,
  addProvisioning,
  editProvisioning,
  removeProvisioning,
  setHasProvisioning,
};

export default lizing.reducer;
