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
import { v4 } from 'uuid';
import {
  IAffiliatedOrganization,
  IBankAccount,
  IDebt,
} from '../../../models/client.model';
import {
  addAffilatedOrganisation,
  defaultOrganisation,
  editAffilatedOrganisation,
} from '../../../store/client';
import { IOkapsAppState } from '../../../store/okaps';

@Component({
  selector: 'app-affilated-companies-dialog-form',
  templateUrl: './affilated-companies-dialog-form.component.html',
  styleUrls: ['./affilated-companies-dialog-form.component.scss'],
})
export class AffilatedCompaniesDialogFormComponent implements OnInit {
  form: FormGroup;

  index: number;
  initialState: IAffiliatedOrganization = {
    ...defaultOrganisation,
    head: null,
  };

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<IOkapsAppState>,
    public dialogRef: MatDialogRef<AffilatedCompaniesDialogFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data?: { index: number; state: IAffiliatedOrganization }
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
      ? 'Добавление аффилированной компании'
      : 'Редактирование аффилированной компании';
  }

  generateForm(): void {
    this.form = this.formBuilder.group({
      id: [this.initialState.id],
      fullName: [this.initialState.fullName, Validators.required],
      identifier: [this.initialState.identifier, Validators.required],
      address: this.formBuilder.group({
        fact: null,
        register: [this.initialState?.address?.register, Validators.required],
      }),
      bankAccounts: this.formBuilder.array([]),
      shareInCapital: [
        this.initialState.shareInCapital,
        Validators.compose([
          Validators.required,
          Validators.min(0),
          Validators.max(100),
        ]),
      ],
      debts: this.formBuilder.array([]),
      head: this.formBuilder.group({
        identifier: [this.initialState?.head?.identifier, Validators.required],
        fullName: [this.initialState?.head?.fullName, Validators.required],
      }),
    });

    this.initialState.bankAccounts.forEach((ba) => this.addBankAccount(ba));
    this.initialState.debts.forEach((d) => this.addDebt(d));
  }

  get fullname() {
    return this.form.get('fullName');
  }
  get identifier() {
    return this.form.get('identifier');
  }
  get address() {
    return this.form.get('address');
  }
  get shareInCapital() {
    return this.form.get('shareInCapital');
  }
  get bankAccounts() {
    return this.form.get('bankAccounts') as FormArray;
  }
  get debts() {
    return this.form.get('debts') as FormArray;
  }
  get head() {
    return this.form.get('head');
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

  addDebt(data?: IDebt) {
    this.debts.push(
      new FormGroup({
        id: new FormControl(data?.id),
        debt: new FormControl(data?.debt, Validators.required),
        bic: new FormControl(data?.bic),
      })
    );
  }

  removeDebt(i) {
    this.debts.removeAt(i);
  }

  onFormSubmit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.isNew) {
      this.store.dispatch(addAffilatedOrganisation(this.form.value));
    } else {
      this.store.dispatch(
        editAffilatedOrganisation({
          index: this.index,
          data: this.form.value,
        })
      );
    }

    this.dialogRef.close();
  }
}
