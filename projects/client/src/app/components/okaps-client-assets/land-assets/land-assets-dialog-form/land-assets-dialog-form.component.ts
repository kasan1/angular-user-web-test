import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ILandActivity } from 'projects/okaps/src/app/models/assets.model';
import { IDictionaryBase } from 'projects/okaps/src/app/models/common.model';
import {
  addLandAssets,
  editLandAssets,
} from 'projects/okaps/src/app/store/assets';
import { IOkapsAppState } from 'projects/okaps/src/app/store/okaps';

@Component({
  selector: 'app-land-assets-dialog-form',
  templateUrl: './land-assets-dialog-form.component.html',
  styleUrls: ['./land-assets-dialog-form.component.scss'],
})
export class LandAssetsDialogFormComponent implements OnInit {
  form: FormGroup;
  initialState: ILandActivity = {
    id: null,
    landTypeId: null,
    landType: null,
    ownershipTypeId: null,
    ownershipType: null,
    square: 0,
  };

  landTypes: IDictionaryBase[] = [];
  ownershipTypes: IDictionaryBase[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<IOkapsAppState>,
    public dialogRef: MatDialogRef<LandAssetsDialogFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data?: {
      initialData: ILandActivity;
      landTypes: IDictionaryBase[];
      ownershipTypes: IDictionaryBase[];
    }
  ) {
    if (!!data.initialData) {
      this.initialState = data.initialData;
    }
    this.landTypes = data.landTypes;
    this.ownershipTypes = data.ownershipTypes;
  }

  ngOnInit(): void {
    this.generateForm();

    this.landTypeId.valueChanges.subscribe((value) => {
      this.landType.setValue(this.landTypes.find((x) => x.id === value).name);
    });
    this.ownershipTypeId.valueChanges.subscribe((value) => {
      this.ownershipType.setValue(
        this.ownershipTypes.find((x) => x.id === value).name
      );
    });
  }

  get isNew() {
    return this.initialState.id === null;
  }

  get title() {
    return this.isNew
      ? 'Добавление земельного ресурса'
      : 'Редактирование земельного ресурса';
  }

  generateForm(): void {
    this.form = this.formBuilder.group({
      id: [this.initialState.id],
      landTypeId: [this.initialState.landTypeId, Validators.required],
      landType: [this.initialState.landType, Validators.required],
      ownershipTypeId: [this.initialState.ownershipTypeId, Validators.required],
      ownershipType: [this.initialState.ownershipType, Validators.required],
      square: [
        this.initialState.square,
        Validators.compose([Validators.required, Validators.min(1)]),
      ],
    });
  }

  get landTypeId() {
    return this.form.get('landTypeId');
  }
  get landType() {
    return this.form.get('landType');
  }
  get ownershipTypeId() {
    return this.form.get('ownershipTypeId');
  }
  get ownershipType() {
    return this.form.get('ownershipType');
  }
  get square() {
    return this.form.get('square');
  }

  onFormSubmit(): void {
    if (!this.form.valid) return;

    if (this.isNew) {
      this.store.dispatch(addLandAssets(this.form.value));
    } else {
      this.store.dispatch(editLandAssets(this.form.value));
    }

    this.dialogRef.close();
  }
}
