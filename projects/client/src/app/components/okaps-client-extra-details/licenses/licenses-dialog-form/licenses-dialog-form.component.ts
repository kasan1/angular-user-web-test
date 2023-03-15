import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { IOrganizationLicense } from 'projects/okaps/src/app/models/client.model';
import {
  addLicense,
  editLicense,
} from 'projects/okaps/src/app/store/client.extra';
import { IOkapsAppState } from 'projects/okaps/src/app/store/okaps';

@Component({
  selector: 'app-licenses-dialog-form',
  templateUrl: './licenses-dialog-form.component.html',
  styleUrls: ['./licenses-dialog-form.component.scss'],
})
export class LicensesDialogFormComponent implements OnInit {
  form: FormGroup;

  index: number | undefined = undefined;
  initialState: IOrganizationLicense = {
    id: null,
    document: {
      id: null,
      number: null,
      issuer: null,
      dateIssue: null,
    },
    essence: null,
  };

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<IOkapsAppState>,
    public dialogRef: MatDialogRef<LicensesDialogFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data?: {
      initialData: IOrganizationLicense;
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
    return this.isNew ? 'Добавить лицензию' : 'Редактирование лицензии';
  }

  generateForm(): void {
    this.form = this.formBuilder.group({
      id: [this.initialState.id],
      document: this.formBuilder.group({
        id: [this.initialState.document.id],
        number: [this.initialState.document.number, Validators.required],
        issuer: [this.initialState.document.issuer, Validators.required],
        dateIssue: [this.initialState.document.dateIssue, Validators.required],
      }),
      essence: [
        this.initialState.essence,
        Validators.compose([Validators.required, Validators.maxLength(200)]),
      ],
    });
  }

  get document() {
    return this.form.get('document') as FormGroup;
  }
  get essence() {
    return this.form.get('essence');
  }

  onFormSubmit(): void {
    if (!this.form.valid) return;

    if (this.isNew) {
      this.store.dispatch(addLicense(this.form.value));
    } else {
      this.store.dispatch(
        editLicense({ index: this.index, data: this.form.value })
      );
    }

    this.dialogRef.close();
  }
}
