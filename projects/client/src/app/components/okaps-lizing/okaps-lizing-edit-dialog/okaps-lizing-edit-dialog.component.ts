import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import {
  ILizingContract,
  LizingFormDialogIProps,
} from '../../../models/lizing.model';
import { CalculatorService } from '../../../services/calculator.service';
import { DictionariesService } from '../../../services/dictionaries.service';
import {
  addOrUpdateAccessoryForm,
  addOrUpdateProductForm,
} from '../../../store/lizing';
import { IOkapsAppState } from '../../../store/okaps';
import { OkapsLizingFormBaseComponent } from '../okaps-lizing-form-base/okaps-lizing-form-base.component';

@Component({
  selector: 'app-okaps-lizing-edit-dialog',
  templateUrl: './okaps-lizing-edit-dialog.component.html',
  styleUrls: ['./okaps-lizing-edit-dialog.component.scss'],
})
export class OkapsLizingEditDialogComponent
  extends OkapsLizingFormBaseComponent
  implements OnInit {
  lizingContract: ILizingContract | null = null;

  constructor(
    public store: Store<IOkapsAppState>,
    public formBuilder: FormBuilder,
    public dictionaryService: DictionariesService,
    public calculatorService: CalculatorService,
    public snackbar: MatSnackBar,
    public dialogRef: MatDialogRef<OkapsLizingEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LizingFormDialogIProps
  ) {
    super(store, formBuilder, dictionaryService, calculatorService, snackbar);

    this.id = data.id;
    this.maxPrice = data.maxPrice;
    this.accessoryIndex = data.accessoryIndex;
    this.formInitialValues = data.formInitialValues;

    this.store
      .select((state: IOkapsAppState) => state.lizing.contractsData[data.id])
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((contract) => {
        if (contract) {
          this.lizingContract = contract;

          if (this.isProductForm) {
            this.dictionaries = contract.productDictionaries;
          } else {
            this.dictionaries =
              contract.accessories[this.accessoryIndex].accessoryDictionaries;
          }
        }
      });
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  get title() {
    return this.isProductForm
      ? 'Редактирование техники'
      : 'Добавление/Редактирование комплектующей';
  }

  onFormSubmit() {
    if (this.isProductForm) {
      this.store.dispatch(
        addOrUpdateProductForm({
          contractIndex: this.id,
          form: this.form.value,
        })
      );
    } else {
      this.store.dispatch(
        addOrUpdateAccessoryForm({
          contractIndex: this.id,
          accessoryIndex: this.accessoryIndex,
          form: this.form.value,
        })
      );
    }

    this.calculate();

    this.dialogRef.close();
  }
}
