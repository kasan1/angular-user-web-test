import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { fadeInTrigger, fadeInOutTrigger } from 'projects/shared/util/triggers';
import { IFileInfo } from 'projects/shared/models/fileInfo';
import { BehaviorSubject, of } from 'rxjs';
import { groupBy, cloneDeep } from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'projects/shared/components/confirmation-dialog/confirmation-dialog.component';
import { take, map, switchMap, finalize } from 'rxjs/operators';
import { BpmFileService } from 'projects/bpm/src/app/services/bpm-file.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BpmDictionaryService } from 'projects/bpm/src/app/services/dictionary.service';
import {
  dictionaries,
  IDictionaryItem,
} from 'projects/shared/services/dictionary.service';
import { Store } from '@ngrx/store';
import { IBpmAppState } from 'projects/bpm/src/app/store/bpm';
import { deleteBpmApplicationFiles } from '../../store/bpm-application.reducers';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bpm-application-files',
  templateUrl: './bpm-application-files.component.html',
  styleUrls: ['./bpm-application-files.component.scss'],
  animations: [fadeInTrigger, fadeInOutTrigger],
})
export class BpmApplicationFilesComponent implements OnInit, OnChanges {
  @Input() files: IFileInfo[] = [];
  @Input() fileUploadType: FileUploadType = 'instant';
  @Input() hasActions = true;
  @Input() elevation = true;

  @Output() deferredFileChange: EventEmitter<IFileInfo[]> = new EventEmitter();
  @Output() deletedInitialFile: EventEmitter<IFileInfo> = new EventEmitter();

  fileTypesCache: IDictionaryItem[] = [];

  groups$ = new BehaviorSubject<{
    keys: string[];
    values: { [key: string]: IFileInfo[] };
  }>(null);

  constructor(
    private dialog: MatDialog,
    private service: BpmFileService,
    private snackbar: MatSnackBar,
    private dictService: BpmDictionaryService,
    private store: Store<IBpmAppState>
  ) {}

  ngOnInit(): void {
    this._initialize();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.files.firstChange) this._groupFiles();
  }

  fileDeleted = (key: string, event: IFileInfo) => {
    const current = { ...this.groups$.value };
    current.values[key] = current.values[key].filter((x) => x.id != event.id);
    if (!current.values[key].length) {
      current.keys = current.keys.filter((x) => x != key);
      delete current.values[key];
    }

    if (event.id)
      this.store.dispatch(
        deleteBpmApplicationFiles({ page: event.page, ids: [event.id] })
      );

    this.groups$.next(current);
  };

  filesUploaded = (key: string, event: IFileInfo[]) => {
    const current = { ...this.groups$.value };
    current.values[key].push(...event);
    this.groups$.next(current);
  };

  fileChangeDeferred = (key: string, event: IFileInfo[]) => {
    const current = { ...this.groups$.value };
    current.values[key] = [
      ...current.values[key].filter((x) => x.id),
      ...event,
    ];
    if (!current.values[key].length) {
      current.keys = current.keys.filter((x) => x != key);
      delete current.values[key];
    }

    this.groups$.next(current);
    this.deferredFileChange.emit(current.values[key]);
  };

  deleteDocument = (key: string, files: IFileInfo[]) => {
    if (!files.length) return;

    const ids = files.filter((f) => f.id).map((f) => f.id);

    this.dialog
      .open(ConfirmationDialogComponent, {
        panelClass: ['d-lg', 'md-md', 'xl-sm'],
        autoFocus: true,
        hasBackdrop: true,
        data: {
          title: 'Подтверждение',
          text:
            'Вы уверены что хотите удалить документ и все вложенные в него файлы?',
        },
      })
      .afterClosed()
      .pipe(
        take(1),
        switchMap((x) =>
          x
            ? this.service.delete(ids).pipe(
                take(1),
                finalize(() => {
                  this.snackbar.open('Документ успешно удален');

                  this.store.dispatch(
                    deleteBpmApplicationFiles({ page: files[0].page, ids })
                  );

                  const current = { ...this.groups$.value };
                  current.keys = current.keys.filter((k) => k != key);
                  delete current.values[key];

                  this.groups$.next(current);
                })
              )
            : of(null)
        )
      )
      .subscribe();
  };

  _groupFiles = () => {
    const files = cloneDeep(this.files);
    for (let i = 0; i < files.length; i++) {
      files[i]['groupKey'] = `${files[i].code}.${files[i].number || 'n/a'}.${
        files[i].date || 'n/a'
      }`;

      const item = this.fileTypesCache.find((s) => +s.code == files[i].code);
      files[i]['section'] = item ? item.nameRu : 'Не указано';
    }

    const group = groupBy(files, 'groupKey');
    this.groups$.next({
      keys: Object.keys(group),
      values: group,
    });
  };

  _initialize = () => {
    this.dictService
      .dictionaryItems(dictionaries.dicFileType)
      .pipe(
        take(1),
        map((x) => {
          if (!this.fileTypesCache.length) this.fileTypesCache = x;

          this._groupFiles();
        })
      )
      .subscribe();
  };
}

type FileUploadType = 'defer' | 'instant';
