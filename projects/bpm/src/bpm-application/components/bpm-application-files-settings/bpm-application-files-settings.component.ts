import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { fadeInTrigger } from 'projects/shared/util/triggers';
import { IFileInfo } from 'projects/shared/models/fileInfo';
import { groupBy } from 'lodash';
import { BpmDictionaryService } from 'projects/bpm/src/app/services/dictionary.service';
import {
  IDictionaryItem,
  dictionaries,
} from 'projects/shared/services/dictionary.service';
import { take, map, switchMap, catchError } from 'rxjs/operators';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Observable, Subject, of } from 'rxjs';
import { BpmFileService } from 'projects/bpm/src/app/services/bpm-file.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { formatDate } from '@angular/common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bpm-application-files-settings',
  templateUrl: './bpm-application-files-settings.component.html',
  styleUrls: ['./bpm-application-files-settings.component.scss'],
  animations: [fadeInTrigger],
})
export class BpmApplicationFilesSettingsComponent implements OnInit {
  @Input() appId: string;
  form: FormGroup;
  files$: Observable<IFileInfo[]>;
  loading$ = new Subject<boolean>();

  constructor(
    private service: BpmDictionaryService,
    private files: BpmFileService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this._initializeForm();
    this.loading$.next(true);
    this.files$ = this.service.dictionaryItems(dictionaries.dicFileType).pipe(
      take(1),
      switchMap((x) =>
        this.files.load({ appId: this.appId }).pipe(
          take(1),
          map((files) => {
            this.loading$.next(false);
            this._groupFiles(x, files);

            return files;
          })
        )
      ),
      catchError(() => {
        this.loading$.next(false);
        return of(null);
      })
    );
  }

  submit = () => {
    this.loading$.next(true);
    this.files
      .updateDocInformation(this.form.value)
      .pipe(take(1))
      .subscribe(
        (x) => {
          this.loading$.next(false);
          if (x) this.snackbar.open('Данные успешно сохранены');
        },
        () => this.loading$.next(false)
      );
  };

  items = () => this.form.get('items') as FormArray;

  _groupFiles = (x: IDictionaryItem[], files: IFileInfo[]) => {
    files.forEach((file) => {
      const type = x.find((i) => i.code == file.code.toString());
      if (!type) return;

      file['title'] = `${type.nameRu}${
        file.date
          ? '\n     От ' + formatDate(file.date, 'dd.MM.yyyy', 'en', 'UTC/GMT')
          : ''
      }${file.number ? '\n     №' + file.number : ''}`;
    });

    const group = groupBy(files, 'title');
    console.log(group);
    Object.keys(group).forEach((key) => {
      const item = this._fileItem();
      item.patchValue({
        key,
        applicationId: this.appId,
        code: group[key][0].code,
        isOriginal: group[key][0].isOriginal,
        pageCount: group[key][0].pageCount,
        pageInterval: group[key][0].pageInterval,
      });

      this.items().push(item);
    });

    this.cdr.detectChanges();
  };

  _initializeForm = () =>
    (this.form = this.fb.group({
      items: this.fb.array([]),
    }));

  _fileItem = () =>
    this.fb.group({
      applicationId: [''],
      key: [''],
      code: [''],
      isOriginal: [false],
      pageCount: [0],
      pageInterval: [''],
    });
}
