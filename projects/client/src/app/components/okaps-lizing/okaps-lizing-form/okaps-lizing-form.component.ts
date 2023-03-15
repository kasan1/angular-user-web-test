import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  addOrUpdateProductForm,
  updateProductDictionaries,
} from '../../../store/lizing';
import { IOkapsAppState } from '../../../store/okaps';
import { OkapsLizingFormBaseComponent } from '../okaps-lizing-form-base/okaps-lizing-form-base.component';
import {
  IProductDictinaries,
  IProductFormState,
} from '../../../models/lizing.model';
import { DictionariesService } from '../../../services/dictionaries.service';
import { CalculatorService } from '../../../services/calculator.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-okaps-lizing-form',
  templateUrl: './okaps-lizing-form.component.html',
  styleUrls: ['./okaps-lizing-form.component.scss'],
})
export class OkapsLizingFormComponent
  extends OkapsLizingFormBaseComponent
  implements OnInit {
  constructor(
    public store: Store<IOkapsAppState>,
    public formBuilder: FormBuilder,
    public dictionaryService: DictionariesService,
    public calculatorService: CalculatorService,
    public snackbar: MatSnackBar
  ) {
    super(store, formBuilder, dictionaryService, calculatorService, snackbar);
  }

  ngOnInit(): void {
    this.store
      .select(
        (state: IOkapsAppState) =>
          state.lizing.contractsData[this.id]?.productForm
      )
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((form: IProductFormState) => {
        if (form !== undefined) this.formInitialValues = form;
      });
    this.store
      .select(
        (state: IOkapsAppState) =>
          state.lizing.contractsData[this.id]?.productDictionaries
      )
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((dictionaries: IProductDictinaries) => {
        if (dictionaries !== undefined) this.dictionaries = dictionaries;
      });

    if (this.dictionaries.techTypesCollection.length === 0) {
      this.initiallyLoading = true;
      this.dictionaryService
        .getTechTypes({
          loanProductId: 'A039445D-6A52-45E0-BCBF-032B850F8FFB', // TODO: get from db
        })
        .then((response) => {
          this.store.dispatch(
            updateProductDictionaries({
              contractIndex: this.id,
              dictionaries: {
                ...this.dictionaries,
                techTypesCollection: response.data.list,
              },
            })
          );
        })
        .finally(() => (this.initiallyLoading = false));
    }

    super.ngOnInit();
  }

  onFormSubmit() {
    this.store.dispatch(
      addOrUpdateProductForm({
        contractIndex: this.id,
        form: this.form.value,
      })
    );

    this.calculate();
  }
}
