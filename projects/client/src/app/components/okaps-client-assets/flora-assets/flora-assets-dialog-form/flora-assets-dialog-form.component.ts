import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { IFloraActivity } from 'projects/okaps/src/app/models/assets.model';
import { IDictionaryBase } from 'projects/okaps/src/app/models/common.model';
import {
  addFloraAssets,
  editFloraAssets,
} from 'projects/okaps/src/app/store/assets';
import { IOkapsAppState } from 'projects/okaps/src/app/store/okaps';

@Component({
  selector: 'app-flora-assets-dialog-form',
  templateUrl: './flora-assets-dialog-form.component.html',
  styleUrls: ['./flora-assets-dialog-form.component.scss'],
})
export class FloraAssetsDialogFormComponent implements OnInit {
  form: FormGroup;
  initialState: IFloraActivity = {
    id: null,
    cultureId: null,
    culture: null,
    plannedSquare: 0,
    seedingRate: 0,
    priceRealization: 0,
    cost: 0,
    productivityCurrentYear: 0,
    productivityLastYear: 0,
    productivityBeforeLastYear: 0,
  };

  cultures: IDictionaryBase[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<IOkapsAppState>,
    public dialogRef: MatDialogRef<FloraAssetsDialogFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data?: {
      initialData: IFloraActivity;
      cultures: IDictionaryBase[];
    }
  ) {
    if (!!data.initialData) {
      this.initialState = data.initialData;
    }
    this.cultures = data.cultures;
  }

  ngOnInit(): void {
    this.generateForm();

    this.cultureId.valueChanges.subscribe((value) => {
      this.culture.setValue(this.cultures.find((x) => x.id === value).name);
    });
  }

  get isNew() {
    return this.initialState.id === null;
  }

  get title() {
    return this.isNew
      ? 'Добавление урожайного ресурса'
      : 'Редактирование урожайного ресурса';
  }

  generateForm(): void {
    this.form = this.formBuilder.group({
      id: [this.initialState.id],
      cultureId: [this.initialState.cultureId, Validators.required],
      culture: [this.initialState.culture, Validators.required],
      plannedSquare: [
        this.initialState.plannedSquare,
        Validators.compose([Validators.required, Validators.min(1)]),
      ],
      seedingRate: [
        this.initialState.seedingRate,
        Validators.compose([Validators.required, Validators.min(1)]),
      ],
      priceRealization: [
        this.initialState.priceRealization,
        Validators.compose([Validators.required, Validators.min(1)]),
      ],
      cost: [
        this.initialState.cost,
        Validators.compose([Validators.required, Validators.min(1)]),
      ],
      productivityCurrentYear: [this.initialState.productivityCurrentYear],
      productivityLastYear: [this.initialState.productivityLastYear],
      productivityBeforeLastYear: [
        this.initialState.productivityBeforeLastYear,
      ],
    });
  }

  get cultureId() {
    return this.form.get('cultureId');
  }
  get culture() {
    return this.form.get('culture');
  }
  get plannedSquare() {
    return this.form.get('plannedSquare');
  }
  get seedingRate() {
    return this.form.get('seedingRate');
  }
  get priceRealization() {
    return this.form.get('priceRealization');
  }
  get cost() {
    return this.form.get('cost');
  }
  get productivity() {
    return this.form.get('productivity') as FormArray;
  }

  getYear() {
    let year = new Date().getFullYear();

    return year - this.productivity.length;
  }

  onFormSubmit(): void {
    if (!this.form.valid) return;

    if (this.isNew) {
      this.store.dispatch(addFloraAssets(this.form.value));
    } else {
      this.store.dispatch(editFloraAssets(this.form.value));
    }

    this.dialogRef.close();
  }
}
