import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { IFLOwner } from 'projects/okaps/src/app/models/client.model';
import {
  addFlOwner,
  editFlOwner,
} from 'projects/okaps/src/app/store/client.extra';
import { IOkapsAppState } from 'projects/okaps/src/app/store/okaps';

@Component({
  selector: 'app-physical-owners-dialog-form',
  templateUrl: './physical-owners-dialog-form.component.html',
  styleUrls: ['./physical-owners-dialog-form.component.scss'],
})
export class PhysicalOwnersDialogFormComponent implements OnInit {
  form: FormGroup;
  index: number | undefined = undefined;
  initialState: IFLOwner = {
    id: null,
    personId: null,
    fullName: null,
    identificationDocument: {
      id: null,
      number: null,
      issuer: null,
      dateIssue: null,
    },
    address: {
      id: null,
      fact: null,
      register: null,
    },
  };

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<IOkapsAppState>,
    public dialogRef: MatDialogRef<PhysicalOwnersDialogFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data?: {
      initialData: IFLOwner;
      index: number;
    }
  ) {
    if (!!data.initialData) {
      this.initialState = data.initialData;
      this.index = data.index;
    }
  }

  ngOnInit(): void {
    this.generateForm();
  }

  get isNew() {
    return this.index === undefined;
  }

  get title() {
    return this.isNew ? 'Добавить собственника' : 'Редактирование собственника';
  }

  generateForm(): void {
    this.form = this.formBuilder.group({
      id: [this.initialState.id],
      personId: [this.initialState.personId],
      fullName: [this.initialState.fullName, Validators.required],
      identificationDocument: this.formBuilder.group({
        id: [this.initialState.identificationDocument.id],
        number: [
          this.initialState.identificationDocument.number,
          Validators.required,
        ],
        issuer: [
          this.initialState.identificationDocument.issuer,
          Validators.required,
        ],
        dateIssue: [
          this.initialState.identificationDocument.dateIssue,
          Validators.required,
        ],
      }),
      address: this.formBuilder.group({
        id: [this.initialState.address.id],
        fact: [this.initialState.address.fact, Validators.required],
        register: [this.initialState.address.register],
      }),
    });
  }

  get fullname() {
    return this.form.get('fullName');
  }
  get identificationDocument() {
    return this.form.get('identificationDocument') as FormGroup;
  }
  get address() {
    return this.form.get('address') as FormGroup;
  }

  onFormSubmit(): void {
    if (!this.form.valid) return;

    if (this.isNew) {
      this.store.dispatch(addFlOwner(this.form.value));
    } else {
      this.store.dispatch(
        editFlOwner({ index: this.index, data: this.form.value })
      );
    }

    this.dialogRef.close();
  }
}
