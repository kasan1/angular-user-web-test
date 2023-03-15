import { isEmpty } from 'lodash';
import {
  ILizingContractResponse,
  IProductDictinaries,
} from '../models/lizing.model';
import { ILizingState } from '../models/lizing.model';

const dictionariesDefaulState: IProductDictinaries = {
  techTypesCollection: [],
  techSubtypesCollection: [],
  techProductsCollection: [],
  modelsCollection: [],
  manufacturersCollection: [],
  suppliersCollection: [],
};

export const convertToStoreObject = (
  data: ILizingContractResponse[],
  applicationId: string
): ILizingState => {
  const state: ILizingState = {
    applicationId,
    contracts: [],
    contractsData: {},
    submitted: false,
    persistant: true,
  };

  data.forEach((contract) => {
    if (!isEmpty(contract.id)) {
      state.contracts.push(contract.id);
      state.contractsData[contract.id] = {
        permanent: true,
        productForm: {
          techType: contract.technic.techTypes.find(
            (x) => x.id === contract.technic.techTypeId
          ),
          techSubtype: contract.technic.techSubtypes.find(
            (x) => x.id === contract.technic.techSubtypeId
          ),
          techProduct: contract.technic.techProducts.find(
            (x) => x.id === contract.technic.techProductId
          ),
          model: contract.technic.techModels.find(
            (x) => x.id === contract.technic.techModelId
          ),
          manufacturer: contract.technic.countries.find(
            (x) => x.id === contract.technic.countryId
          ),
          supplier: contract.technic.providers.find(
            (x) => x.id === contract.technic.providerId
          ),
          price: contract.technic.price,
          count: contract.technic.count,
        },
        productDictionaries: {
          techTypesCollection: contract.technic.techTypes,
          techSubtypesCollection: contract.technic.techSubtypes,
          techProductsCollection: contract.technic.techProducts,
          modelsCollection: contract.technic.techModels,
          manufacturersCollection: contract.technic.countries,
          suppliersCollection: contract.technic.providers,
        },
        accessories: contract.accessories.map((accessory) => ({
          accessoryForm: {
            id: accessory.id,
            techType: null,
            techSubtype: null,
            techProduct: accessory.techProducts.find(
              (x) => x.id === accessory.techProductId
            ),
            model: accessory.techModels.find(
              (x) => x.id === accessory.techModelId
            ),
            manufacturer: accessory.countries.find(
              (x) => x.id === accessory.countryId
            ),
            supplier: accessory.providers.find(
              (x) => x.id === accessory.providerId
            ),
            price: accessory.price,
            count: accessory.count,
          },
          accessoryDictionaries: {
            techTypesCollection: [],
            techSubtypesCollection: [],
            techProductsCollection: accessory.techProducts,
            modelsCollection: accessory.techModels,
            manufacturersCollection: accessory.countries,
            suppliersCollection: accessory.providers,
          },
        })),
        calculatorForm: contract.calculator,
        calculatorResult: contract.calculatorResult,
        hasProvisions: contract.hasProvisions,
        provisions: contract.provisions,
      };

      state.contractsData[contract.id].accessories.push({
        accessoryForm: null,
        accessoryDictionaries: dictionariesDefaulState,
      });
    }
  });

  return state;
};
