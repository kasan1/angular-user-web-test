import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ITechnicActivity } from 'projects/okaps/src/app/models/assets.model';
import {
  addTechnicAssets,
  editTechnicAssets,
} from 'projects/okaps/src/app/store/assets';
import { IOkapsAppState } from 'projects/okaps/src/app/store/okaps';

@Component({
  selector: 'app-technic-assets-dialog-form',
  templateUrl: './technic-assets-dialog-form.component.html',
  styleUrls: ['./technic-assets-dialog-form.component.scss'],
})
export class TechnicAssetsDialogFormComponent implements OnInit {
  form: FormGroup;
  initialState: ITechnicActivity = {
    id: null,
    fullname: null,
    dateIssue: null,
    count: 0,
    countOfCorrect: 0,
    isPledged: false,
    pledgeDescription: null,
  };

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<IOkapsAppState>,
    public dialogRef: MatDialogRef<TechnicAssetsDialogFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data?: {
      initialData: ITechnicActivity;
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
      ? 'Добавление производственного ресурса'
      : 'Редактирование производственного ресурса';
  }

  generateForm(): void {
    this.form = this.formBuilder.group({
      id: [this.initialState.id],
      fullname: [this.initialState.fullname, Validators.required],
      dateIssue: [this.initialState.dateIssue, Validators.required],
      count: [
        this.initialState.count,
        Validators.compose([Validators.required, Validators.min(1)]),
      ],
      countOfCorrect: [
        this.initialState.countOfCorrect,
        Validators.compose([Validators.required, Validators.min(0)]),
      ],
      isPledged: [this.initialState.isPledged, Validators.required],
      pledgeDescription: [this.initialState.pledgeDescription],
    });
  }

  get fullname() {
    return this.form.get('fullname');
  }
  get dateIssue() {
    return this.form.get('dateIssue');
  }
  get count() {
    return this.form.get('count');
  }
  get countOfCorrect() {
    return this.form.get('countOfCorrect');
  }
  get isPledged() {
    return this.form.get('isPledged');
  }
  get pledgeDescription() {
    return this.form.get('pledgeDescription');
  }

  onFormSubmit(): void {
    if (!this.form.valid) return;

    if (this.isNew) {
      this.store.dispatch(addTechnicAssets(this.form.value));
    } else {
      this.store.dispatch(editTechnicAssets(this.form.value));
    }

    this.dialogRef.close();
  }
}
