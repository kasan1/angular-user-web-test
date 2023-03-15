import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { IDocument } from 'projects/okaps/src/app/models/client.model';
import {
  addCertificate,
  editCertificate,
} from 'projects/okaps/src/app/store/client.extra';
import { IOkapsAppState } from 'projects/okaps/src/app/store/okaps';

@Component({
  selector: 'app-vat-certificate-dialog-form',
  templateUrl: './vat-certificate-dialog-form.component.html',
  styleUrls: ['./vat-certificate-dialog-form.component.scss'],
})
export class VatCertificateDialogFormComponent implements OnInit {
  form: FormGroup;
  initialState: IDocument = {
    id: null,
    number: null,
    issuer: null,
    dateIssue: null,
  };

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<IOkapsAppState>,
    public dialogRef: MatDialogRef<VatCertificateDialogFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data?: {
      initialData: IDocument;
    }
  ) {
    if (!!data.initialData) {
      this.initialState = data.initialData;
    }
  }

  ngOnInit(): void {
    this.generateForm();
  }

  get isNew() {
    return this.initialState.id === null;
  }

  get title() {
    return this.isNew
      ? 'Добавить сертификат НДС'
      : 'Редактирование сертификата НДС';
  }

  generateForm(): void {
    this.form = this.formBuilder.group({
      id: [this.initialState.id],
      number: [this.initialState.number, Validators.required],
      dateIssue: [this.initialState.dateIssue, Validators.required],
      issuer: [this.initialState.issuer, Validators.required],
    });
  }

  get number() {
    return this.form.get('number');
  }
  get dateIssue() {
    return this.form.get('dateIssue');
  }
  get issuer() {
    return this.form.get('issuer');
  }

  onFormSubmit(): void {
    if (!this.form.valid) return;

    if (this.isNew) {
      this.store.dispatch(addCertificate(this.form.value));
    } else {
      this.store.dispatch(editCertificate(this.form.value));
    }

    this.dialogRef.close();
  }
}
