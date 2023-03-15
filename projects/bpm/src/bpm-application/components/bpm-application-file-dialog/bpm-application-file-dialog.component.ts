import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Inject,
} from '@angular/core';
import { fadeInTrigger } from 'projects/shared/util/triggers';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { FilePage, IFileInfo, FileCode } from 'projects/shared/models/fileInfo';
import { BpmFileService } from 'projects/bpm/src/app/services/bpm-file.service';
import { take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bpm-application-file-dialog',
  templateUrl: './bpm-application-file-dialog.component.html',
  styleUrls: ['./bpm-application-file-dialog.component.scss'],
  animations: [fadeInTrigger],
})
export class BpmApplicationFileDialogComponent implements OnInit {
  fileForm: FormGroup;
  codes = [];

  loading = false;

  constructor(
    private fb: FormBuilder,
    private service: BpmFileService,
    private snackbar: MatSnackBar,
    private ref: MatDialogRef<BpmApplicationFileDialogComponent>,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      page: FilePage;
      appId?: string;
      basePledgeId?: string;
      skipSave?: boolean;
      codes: { code: FileCode; title: string }[];
    }
  ) {}

  ngOnInit(): void {
    this.codes = this.data.codes || [];
    this._initializeForm();
  }

  saveFiles = () => {
    if (this.fileForm.invalid) return this.fileForm.markAllAsTouched();

    const result = [];

    this.items().controls.forEach((c) => {
      const files = c.get('files').value;
      if (!files.length) return;

      files.forEach((file: IFileInfo) => {
        file.code = c.get('code').value;
        file.date = c.get('date').value;
        file.number = c.get('number').value;
        file.isOriginal = c.get('isOriginal').value;
        file.appId = this.data.appId;
        file.basePledgeId = this.data.basePledgeId;

        result.push(file);
      });
    });

    if (this.data.skipSave) return this.ref.close(result);

    this.setLoading(true);
    this.service
      .upload(result)
      .pipe(take(1))
      .subscribe(
        () => {
          this.setLoading(false);
          this.snackbar.open('Данные успешно сохранены', null, {
            duration: 2500,
          });
          this.ref.close(true);
        },
        () => this.setLoading(false)
      );
  };

  items = () => this.fileForm.get('items') as FormArray;
  item = (i: number) => this.items().controls[i];

  addItem = () => {
    this.items().push(this._item());
  };

  deleteItem = (i: number) => this.items().removeAt(i);

  setLoading = (value: boolean) => {
    this.loading = value;
    this.cdr.detectChanges();
  };

  code = (i: number) => this.item(i).get('code').value;
  files = (i: number) => this.item(i).get('files');

  fileChange = (i: number, event: IFileInfo[]) => this.files(i).setValue(event);

  _initializeForm = () =>
    (this.fileForm = this.fb.group({
      items: this.fb.array([this._item()]),
    }));

  _item = () =>
    this.fb.group({
      code: [0, Validators.min(1)],
      number: [''],
      date: [''],
      isOriginal: [false],
      files: [[]],
    });
}
