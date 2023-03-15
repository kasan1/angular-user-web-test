import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';
import {
  ICreateLizingApplicationFormValues,
  ILizingAccessoryFormValues,
  ILizingCalculatorFormValues,
  ILizingContractFormValues,
  ILizingTechnicFormValues,
} from '../../models/lizing.model';
import { IOkapsAppState } from '../okaps';

export const selectCreateLizingFormValues = (store: Store<IOkapsAppState>) =>
  store.pipe(
    select((state: IOkapsAppState) => state.lizing.contractsData),
    map((data) => {
      const formData: ICreateLizingApplicationFormValues = {
        contracts: [],
      };

      Object.keys(data).forEach((key) => {
        if (
          data[key].productForm !== null &&
          data[key].calculatorResult !== null
        ) {
          const technic: ILizingTechnicFormValues = {
            techTypeId: data[key].productForm.techType.id,
            techSubtypeId: data[key].productForm.techSubtype.id,
            techProductId: data[key].productForm.techProduct.id,
            techModelId: data[key].productForm.model.id,
            countryId: data[key].productForm.manufacturer.id,
            providerId: data[key].productForm.supplier.id,
            price: data[key].productForm.price,
            count: data[key].productForm.count,
          };

          const accessories: ILizingAccessoryFormValues[] = [];
          data[key].accessories.forEach((accessory) => {
            if (accessory.accessoryForm !== null) {
              accessories.push({
                id: accessory.accessoryForm.id,
                techProductId: accessory.accessoryForm.techProduct.id,
                techModelId: accessory.accessoryForm.model.id,
                countryId: accessory.accessoryForm.manufacturer.id,
                providerId: accessory.accessoryForm.supplier.id,
                price: accessory.accessoryForm.price,
                count: accessory.accessoryForm.count,
              });
            }
          });

          const calculator: ILizingCalculatorFormValues = {
            period: data[key].calculatorForm.period,
            coFinancing: data[key].calculatorForm.coFinancing,
          };

          const contract: ILizingContractFormValues = {
            technic,
            accessories,
            calculator,
            hasProvisions: data[key].hasProvisions,
            provisions: data[key].provisions,
          };

          if (data[key].permanent) contract.id = key;

          formData.contracts.push(contract);
        }
      });

      return formData;
    })
  );

export const selectTotalSum = (store: Store<IOkapsAppState>) =>
  store.pipe(
    select((state: IOkapsAppState) => state.lizing.contractsData),
    map((data) => {
      let totalSum = 0;

      Object.keys(data).forEach((key) => {
        if (data[key].productForm !== null) {
          totalSum += data[key].productForm.price * data[key].productForm.count;

          data[key].accessories.forEach((accessory) => {
            if (accessory.accessoryForm !== null) {
              totalSum +=
                accessory.accessoryForm.price * accessory.accessoryForm.count;
            }
          });
        }
      });

      return totalSum;
    })
  );
