import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ICreditHistory } from '../../../models/client.model';
import { addCreditHistory, editCreditHistory } from '../../../store/client';
import { IOkapsAppState } from '../../../store/okaps';

@Component({
  selector: 'app-credit-history-dialog-form',
  templateUrl: './credit-history-dialog-form.component.html',
  styleUrls: ['./credit-history-dialog-form.component.scss'],
})
export class CreditHistoryDialogFormComponent implements OnInit {
  form: FormGroup;

  index: number;
  initialState: ICreditHistory = {
    id: null,
    fullName: null,
    sum: 0,
    dateIssue: null,
    period: null,
    balance: null,
  };

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<IOkapsAppState>,
    public dialogRef: MatDialogRef<CreditHistoryDialogFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data?: { index: number; state: ICreditHistory }
  ) {
    if (!!data) {
      this.index = data.index;
      this.initialState = data.state;
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
      ? 'Добавление кредитной историй'
      : 'Редактирование кредитной историй';
  }

  generateForm(): void {
    this.form = this.formBuilder.group({
      fullName: [this.initialState.fullName, Validators.required],
      sum: [this.initialState.sum, Validators.required],
      dateIssue: [this.initialState.dateIssue, Validators.required],
      period: [this.initialState.period, Validators.required],
      balance: [this.initialState.balance, Validators.required],
    });
  }

  get fullname() {
    return this.form.get('fullName');
  }
  get sum() {
    return this.form.get('sum');
  }
  get dateIssue() {
    return this.form.get('dateIssue');
  }
  get period() {
    return this.form.get('period');
  }
  get balance() {
    return this.form.get('balance');
  }

  onFormSubmit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.isNew) {
      this.store.dispatch(addCreditHistory(this.form.value));
    } else {
      this.store.dispatch(
        editCreditHistory({
          index: this.index,
          data: this.form.value,
        })
      );
    }

    this.dialogRef.close();
  }
}
