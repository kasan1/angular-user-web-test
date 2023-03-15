import { Component, Inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import {
  IBankAccount,
  IULOwner,
} from 'projects/okaps/src/app/models/client.model';
import {
  addUlOwner,
  editUlOwner,
} from 'projects/okaps/src/app/store/client.extra';
import { IOkapsAppState } from 'projects/okaps/src/app/store/okaps';

@Component({
  selector: 'app-juridical-owners-dialog-form',
  templateUrl: './juridical-owners-dialog-form.component.html',
  styleUrls: ['./juridical-owners-dialog-form.component.scss'],
})
export class JuridicalOwnersDialogFormComponent implements OnInit {
  form: FormGroup;
  index: number | undefined = undefined;
  initialState: IULOwner = {
    id: null,
    fullName: null,
    rate: 0,
    bankAccounts: [],
  };

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<IOkapsAppState>,
    public dialogRef: MatDialogRef<JuridicalOwnersDialogFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data?: {
      initialData: IULOwner;
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
      fullName: [this.initialState.fullName, Validators.required],
      rate: [
        this.initialState.rate,
        Validators.compose([
          Validators.required,
          Validators.min(1),
          Validators.max(100),
        ]),
      ],
      bankAccounts: this.formBuilder.array([], Validators.required),
    });

    this.initialState.bankAccounts.forEach((x) => this.addBankAccount(x));
  }

  get fullName() {
    return this.form.get('fullName');
  }
  get rate() {
    return this.form.get('rate');
  }
  get bankAccounts() {
    return this.form.get('bankAccounts') as FormArray;
  }

  addBankAccount(data?: IBankAccount) {
    this.bankAccounts.push(
      new FormGroup({
        id: new FormControl(data?.id),
        bic: new FormControl(data?.bic, Validators.required),
        number: new FormControl(data?.number, Validators.required),
      })
    );
  }

  removeBankAccount(i: number) {
    this.bankAccounts.removeAt(i);
  }

  onFormSubmit(): void {
    if (!this.form.valid) return;

    if (this.isNew) {
      this.store.dispatch(addUlOwner(this.form.value));
    } else {
      this.store.dispatch(
        editUlOwner({ index: this.index, data: this.form.value })
      );
    }

    this.dialogRef.close();
  }
}
