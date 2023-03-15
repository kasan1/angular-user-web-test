import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ILivestockActivity } from 'projects/okaps/src/app/models/assets.model';
import { IDictionaryBase } from 'projects/okaps/src/app/models/common.model';
import {
  addLiveStockAssets,
  editLiveStockAssets,
} from 'projects/okaps/src/app/store/assets';
import { IOkapsAppState } from 'projects/okaps/src/app/store/okaps';

@Component({
  selector: 'app-livestock-assets-dialog-form',
  templateUrl: './livestock-assets-dialog-form.component.html',
  styleUrls: ['./livestock-assets-dialog-form.component.scss'],
})
export class LivestockAssetsDialogFormComponent implements OnInit {
  form: FormGroup;
  initialState: ILivestockActivity = {
    id: null,
    livestockTypeId: null,
    livestockType: null,
    count: 0,
    liveWeight: 0,
    slaughterWeight: 0,
    livePrice: 0,
    slaughterPrice: 0,
  };

  livestockTypes: IDictionaryBase[] = [];
  parentlivestockTypes: IDictionaryBase[] = [];
  childlivestockTypes: IDictionaryBase[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<IOkapsAppState>,
    public dialogRef: MatDialogRef<LivestockAssetsDialogFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data?: {
      initialData: ILivestockActivity;
      livestockTypes: IDictionaryBase[];
    }
  ) {
    this.livestockTypes = data.livestockTypes;

    if (!!data.initialData) {
      this.initialState = data.initialData;

      this.parentlivestockTypes = data.livestockTypes.filter(
        (x) => x.parentId === null
      );

      const item = data.livestockTypes.find(
        (x) => x.id === data.initialData.livestockTypeId
      );
      this.childlivestockTypes = data.livestockTypes.filter(
        (x) => x.parentId === item.parentId
      );
    } else {
      this.parentlivestockTypes = data.livestockTypes.filter(
        (x) => x.parentId === null
      );
      this.childlivestockTypes = [];
    }
  }

  ngOnInit(): void {
    this.generateForm();

    this.parentlivestockTypeId.valueChanges.subscribe((value) => {
      const parentLivestockType = this.parentlivestockTypes.find(
        (x) => x.id === value
      );
      this.parentlivestockType.setValue(parentLivestockType.name);

      this.childlivestockTypes = this.livestockTypes.filter(
        (x) => x.parentId === parentLivestockType.id
      );
    });

    this.livestockTypeId.valueChanges.subscribe((value) => {
      this.livestockType.setValue(
        this.livestockTypes.find((x) => x.id === value).name
      );
    });
  }

  get isNew() {
    return this.initialState.id === null;
  }

  get title() {
    return this.isNew
      ? 'Добавление биологического ресурса'
      : 'Редактирование биологического ресурса';
  }

  generateForm(): void {
    const selectedLivestockType = this.childlivestockTypes.find(
      (x) => x.id === this.initialState.livestockTypeId
    );

    this.form = this.formBuilder.group({
      id: [this.initialState.id],
      parentlivestockTypeId: [
        !!selectedLivestockType
          ? this.parentlivestockTypes.find(
              (x) => x.id === selectedLivestockType.parentId
            ).id
          : null,
        Validators.required,
      ],
      parentlivestockType: [
        !!selectedLivestockType
          ? this.parentlivestockTypes.find(
              (x) => x.id === selectedLivestockType.parentId
            ).name
          : null,
        Validators.required,
      ],
      livestockTypeId: [this.initialState.livestockTypeId, Validators.required],
      livestockType: [this.initialState.livestockType, Validators.required],
      count: [
        this.initialState.count,
        Validators.compose([Validators.required, Validators.min(1)]),
      ],
      liveWeight: [
        this.initialState.liveWeight,
        Validators.compose([Validators.required, Validators.min(0)]),
      ],
      slaughterWeight: [
        this.initialState.slaughterWeight,
        Validators.compose([Validators.required, Validators.min(0)]),
      ],
      livePrice: [
        this.initialState.livePrice,
        Validators.compose([Validators.required, Validators.min(0)]),
      ],
      slaughterPrice: [
        this.initialState.slaughterPrice,
        Validators.compose([Validators.required, Validators.min(0)]),
      ],
    });
  }

  get parentlivestockTypeId() {
    return this.form.get('parentlivestockTypeId');
  }
  get parentlivestockType() {
    return this.form.get('parentlivestockType');
  }
  get livestockTypeId() {
    return this.form.get('livestockTypeId');
  }
  get livestockType() {
    return this.form.get('livestockType');
  }
  get count() {
    return this.form.get('count');
  }
  get liveWeight() {
    return this.form.get('liveWeight');
  }
  get slaughterWeight() {
    return this.form.get('slaughterWeight');
  }
  get livePrice() {
    return this.form.get('livePrice');
  }
  get slaughterPrice() {
    return this.form.get('slaughterPrice');
  }

  onFormSubmit(): void {
    if (!this.form.valid) return;

    if (this.isNew) {
      this.store.dispatch(addLiveStockAssets(this.form.value));
    } else {
      this.store.dispatch(editLiveStockAssets(this.form.value));
    }

    this.dialogRef.close();
  }
}
