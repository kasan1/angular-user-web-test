import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { IDictionaryBase } from '../../../models/common.model';
import { IProvisioning } from '../../../models/lizing.model';
import { addProvisioning, editProvisioning } from '../../../store/lizing';
import { IOkapsAppState } from '../../../store/okaps';

@Component({
  selector: 'app-provisioning-form-dialog',
  templateUrl: './provisioning-form-dialog.component.html',
  styleUrls: ['./provisioning-form-dialog.component.scss'],
})
export class ProvisioningFormDialogComponent implements OnInit {
  form: FormGroup;
  index: number;
  contractIndex: string;
  initialState: IProvisioning = {
    id: null,
    type: null,
    typeId: null,
    description: null,
    descriptionId: null,
    sum: null,
  };

  provisioningTypes: IDictionaryBase[] = [];
  provisioningDescriptions: IDictionaryBase[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<IOkapsAppState>,
    public dialogRef: MatDialogRef<ProvisioningFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data?: {
      contractIndex: string;
      index: number | null;
      state: IProvisioning | null;
      provisioningTypes: IDictionaryBase[];
      provisioningDescriptions: IDictionaryBase[];
    }
  ) {
    if (!!data && data.index !== null) {
      this.index = data.index;
      this.initialState = data.state;
    }
    this.contractIndex = data.contractIndex;
    this.provisioningTypes = data.provisioningTypes;
    this.provisioningDescriptions = data.provisioningDescriptions;
  }

  ngOnInit(): void {
    this.generateForm();

    this.typeId.valueChanges.subscribe((value: string) => {
      this.type.setValue(
        this.provisioningTypes.find((x) => x.id === value).name
      );
    });

    this.descriptionId.valueChanges.subscribe((value: string) => {
      this.description.setValue(
        this.provisioningDescriptions.find((x) => x.id === value).name
      );
    });
  }

  generateForm(): void {
    this.form = this.formBuilder.group({
      typeId: [this.initialState.typeId, Validators.required],
      type: [this.initialState.type],
      descriptionId: [this.initialState.descriptionId, Validators.required],
      description: [this.initialState.description],
      sum: [this.initialState.sum, Validators.required],
    });
  }

  get isNew() {
    return this.initialState.id === null;
  }

  get title() {
    return this.isNew ? 'Добавить обеспечение' : 'Редактирование обеспечение';
  }

  get type() {
    return this.form.get('type');
  }
  get typeId() {
    return this.form.get('typeId');
  }
  get description() {
    return this.form.get('description');
  }
  get descriptionId() {
    return this.form.get('descriptionId');
  }
  get sum() {
    return this.form.get('sum');
  }

  onFormSubmit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.isNew) {
      this.store.dispatch(
        addProvisioning({
          contractIndex: this.contractIndex,
          data: this.form.value,
        })
      );
    } else {
      this.store.dispatch(
        editProvisioning({
          contractIndex: this.contractIndex,
          provisioningIndex: this.index,
          data: this.form.value,
        })
      );
    }

    this.dialogRef.close();
  }
}
