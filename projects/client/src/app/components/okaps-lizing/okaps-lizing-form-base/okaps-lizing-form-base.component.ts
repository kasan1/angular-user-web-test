import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  IGetManufacturersParams,
  IGetTechModelsParams,
} from '../../../models/dictionary.model';
import {
  ICalculatorInput,
  ILizingContract,
  IProductDictinaries,
  IProductFormState,
} from '../../../models/lizing.model';
import { CalculatorService } from '../../../services/calculator.service';
import { DictionariesService } from '../../../services/dictionaries.service';
import {
  setCalculatorResult,
  updateAccessoryDictionaries,
  updateProductDictionaries,
} from '../../../store/lizing';
import { IOkapsAppState } from '../../../store/okaps';

@Component({
  selector: 'app-okaps-lizing-form-base',
  template: '<template></template>',
})
export class OkapsLizingFormBaseComponent implements OnInit, OnDestroy {
  @Input() id: string;
  @Input() maxPrice: number;

  ngDestroyed$ = new Subject();

  initiallyLoading = false;
  form: FormGroup;
  formInitialValues: IProductFormState;
  dictionaries: IProductDictinaries;

  accessoryIndex: number | null = null;
  contract: ILizingContract;

  constructor(
    public store: Store<IOkapsAppState>,
    public formBuilder: FormBuilder,
    public dictionaryService: DictionariesService,
    public calculatorService: CalculatorService,
    public snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.store
      .select((state: IOkapsAppState) => state.lizing.contractsData[this.id])
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((data) => {
        if (data !== undefined) this.contract = data;
      });

    this.form = this.generateForm();
  }

  ngOnDestroy(): void {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  get isProductForm() {
    return this.accessoryIndex === null;
  }

  get techType(): AbstractControl {
    return this.form.get('techType');
  }

  get techSubtype(): AbstractControl {
    return this.form.get('techSubtype');
  }

  get techProduct(): AbstractControl {
    return this.form.get('techProduct');
  }

  get model(): AbstractControl {
    return this.form.get('model');
  }

  get manufacturer(): AbstractControl {
    return this.form.get('manufacturer');
  }

  get supplier(): AbstractControl {
    return this.form.get('supplier');
  }

  get price(): AbstractControl {
    return this.form.get('price');
  }

  get count(): AbstractControl {
    return this.form.get('count');
  }

  generateForm() {
    return this.formBuilder.group({
      techType: [
        this.formInitialValues !== null
          ? this.formInitialValues.techType
          : null,
        this.isProductForm ? [Validators.required] : [],
      ],
      techSubtype: [
        this.formInitialValues !== null
          ? this.formInitialValues.techSubtype
          : null,
        this.isProductForm ? [Validators.required] : [],
      ],
      techProduct: [
        this.formInitialValues !== null
          ? this.formInitialValues.techProduct
          : null,
        Validators.required,
      ],
      model: [
        this.formInitialValues !== null ? this.formInitialValues.model : null,
        Validators.required,
      ],
      manufacturer: [
        this.formInitialValues !== null
          ? this.formInitialValues.manufacturer
          : null,
        Validators.required,
      ],
      supplier: [
        this.formInitialValues !== null
          ? this.formInitialValues.supplier
          : null,
        Validators.required,
      ],
      price: [
        this.formInitialValues !== null ? this.formInitialValues.price : null,
        [Validators.required, Validators.max(this.maxPrice)],
      ],
      count: [
        this.formInitialValues !== null ? this.formInitialValues.count : null,
        this.isProductForm ? [Validators.required, Validators.min(1)] : [],
      ],
    });
  }

  clearForm(keepKey?: string): void {
    const arrToClear: AbstractControl[] = [];
    // Order is important
    switch (keepKey) {
      case 'techType':
        arrToClear.push(this.techSubtype);
      case 'techSubtype':
        arrToClear.push(this.techProduct);
      case 'techProduct':
        arrToClear.push(this.model);
      case 'model':
        arrToClear.push(this.manufacturer);
      case 'manufacturer':
        arrToClear.push(this.supplier);
      case 'supplier':
        arrToClear.push(this.price);
      case 'price':
        arrToClear.push(this.count);
      case 'count':
        break;
      default:
        break;
    }

    arrToClear.forEach((field) => {
      field.reset();
    });
  }

  onTechTypeChange() {
    this.clearForm('techType');

    if (this.isProductForm) {
      this.dictionaryService
        .getTechTypes({
          parentId: this.techType.value.id,
          loanProductId: 'A039445D-6A52-45E0-BCBF-032B850F8FFB', // TODO: get from db
        })
        .then((response) => {
          if (response.data.list.length === 0) this.showErrorMessage();

          this.store.dispatch(
            updateProductDictionaries({
              contractIndex: this.id,
              dictionaries: {
                ...this.dictionaries,
                techSubtypesCollection: response.data.list,
              },
            })
          );
        })
        .catch(this.showErrorMessage);
    }
  }

  onTechSubtypeChange() {
    this.clearForm('techSubtype');

    this.dictionaryService
      .getTechProducts({
        techTypeId: this.techSubtype.value.id,
      })
      .then((response) => {
        if (response.data.list.length === 0) this.showErrorMessage();

        if (this.isProductForm) {
          this.store.dispatch(
            updateProductDictionaries({
              contractIndex: this.id,
              dictionaries: {
                ...this.dictionaries,
                techProductsCollection: response.data.list,
              },
            })
          );
        }
      })
      .catch(this.showErrorMessage);
  }

  onTechProductChange() {
    this.clearForm('techProduct');

    const params: IGetTechModelsParams = {
      techProductId: this.techProduct.value.id,
    };
    if (!this.isProductForm) params.rate = this.contract.calculatorResult.rate;

    this.dictionaryService
      .getTechModels(params)
      .then((response) => {
        if (response.data.list.length === 0) this.showErrorMessage();

        if (this.isProductForm) {
          this.store.dispatch(
            updateProductDictionaries({
              contractIndex: this.id,
              dictionaries: {
                ...this.dictionaries,
                modelsCollection: response.data.list,
              },
            })
          );
        } else {
          this.store.dispatch(
            updateAccessoryDictionaries({
              contractIndex: this.id,
              accessoryIndex: this.accessoryIndex,
              dictionaries: {
                ...this.dictionaries,
                modelsCollection: response.data.list,
              },
            })
          );
        }
      })
      .catch(this.showErrorMessage);
  }

  onModelChange() {
    this.clearForm('model');

    const params: IGetManufacturersParams = {
      techModelId: this.model.value.id,
    };
    if (!this.isProductForm) params.rate = this.contract.calculatorResult.rate;

    this.dictionaryService
      .getManufacturers(params)
      .then((response) => {
        if (response.data.list.length === 0) this.showErrorMessage();

        if (this.isProductForm) {
          this.store.dispatch(
            updateProductDictionaries({
              contractIndex: this.id,
              dictionaries: {
                ...this.dictionaries,
                manufacturersCollection: response.data.list,
              },
            })
          );
        } else {
          this.store.dispatch(
            updateAccessoryDictionaries({
              contractIndex: this.id,
              accessoryIndex: this.accessoryIndex,
              dictionaries: {
                ...this.dictionaries,
                manufacturersCollection: response.data.list,
              },
            })
          );
        }
      })
      .catch(this.showErrorMessage);
  }

  onManufacturerChange() {
    this.clearForm('manufacturer');

    this.dictionaryService
      .getSuppliers({
        countryId: this.manufacturer.value.id,
        techModelId: this.model.value.id,
      })
      .then((response) => {
        if (response.data.list.length === 0) this.showErrorMessage();

        if (this.isProductForm) {
          this.store.dispatch(
            updateProductDictionaries({
              contractIndex: this.id,
              dictionaries: {
                ...this.dictionaries,
                suppliersCollection: response.data.list,
              },
            })
          );
        } else {
          this.store.dispatch(
            updateAccessoryDictionaries({
              contractIndex: this.id,
              accessoryIndex: this.accessoryIndex,
              dictionaries: {
                ...this.dictionaries,
                suppliersCollection: response.data.list,
              },
            })
          );
        }
      })
      .catch(this.showErrorMessage);
  }

  onSupplierChange() {
    this.clearForm('supplier');
  }

  calculate() {
    const calculateInput: ICalculatorInput = {
      techTypeId: this.contract.productForm.techType.id,
      techSubTypeId: this.contract.productForm.techSubtype.id,
      countryId: this.contract.productForm.manufacturer.id,
      price: this.contract.productForm.price,
      count: this.contract.productForm.count,
      accessories: [],
    };

    this.contract.accessories.forEach((accessory) => {
      if (accessory.accessoryForm !== null) {
        calculateInput.accessories.push({
          price: accessory.accessoryForm.price,
          count: accessory.accessoryForm.count,
        });
      }
    });

    this.calculatorService
      .calculate(calculateInput)
      .then((response) => {
        this.store.dispatch(
          setCalculatorResult({
            contractIndex: this.id,
            data: response.data,
          })
        );
      })
      .catch((err) => {
        let errorMessage = 'Сервис недоступен. Не удалось создать калькулятор';

        if (err.error && err.error.Message) errorMessage = err.error.Message;

        this.snackbar.open(errorMessage, 'Закрыть', {
          duration: 5000,
        });
      });
  }

  showErrorMessage(err?: any) {
    let errorMessage = 'По выбранному справочнику элементов не найдено';
    if (err) {
      errorMessage = 'Произошла ошибка, пожалуйста обратитесь к администратору';

      if (err.error && err.error.Message) errorMessage = err.error.Message;
    }

    this.snackbar.open(errorMessage, 'Закрыть', {
      duration: 5000,
    });
  }
}
