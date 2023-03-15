import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { FilePage, FileCode, IFileInfo } from 'projects/shared/models/fileInfo';
import { BpmFileService } from 'projects/bpm/src/app/services/bpm-file.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'projects/shared/components/confirmation-dialog/confirmation-dialog.component';
import { take, switchMap, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cloneDeep } from 'lodash';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bpm-instant-file-upload',
  templateUrl: './bpm-instant-file-upload.component.html',
  styleUrls: ['./bpm-instant-file-upload.component.scss'],
})
export class BpmInstantFileUploadComponent implements OnInit {
  @Input() page: FilePage;
  @Input() code: FileCode;
  @Input() additionalInfo: any = {};
  @Input() initialFiles: IFileInfo[] = [];
  @Input() hasActions = true;

  @Output() fileDeleted: EventEmitter<IFileInfo> = new EventEmitter();
  @Output() filesUploaded: EventEmitter<IFileInfo[]> = new EventEmitter();

  files: IFileInfo[] = [];

  constructor(
    private service: BpmFileService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.files = cloneDeep(this.initialFiles);
  }

  handleFileDelete = (event: IFileInfo) => {
    if (event.id)
      this.dialog
        .open(ConfirmationDialogComponent, {
          panelClass: ['d-lg', 'md-md', 'xl-sm'],
          autoFocus: true,
          hasBackdrop: true,
          data: {
            title: 'Подтверждение',
            text: `Вы уверены что хотите удалить файл ${event.title}?`,
          },
        })
        .afterClosed()
        .pipe(
          take(1),
          switchMap((x) =>
            x
              ? this.service.delete([event.id]).pipe(
                  take(1),
                  finalize(() => {
                    this.snackbar.open('Файл успешно удален');
                    this.files = this.files.filter((i) => i.id != event.id);

                    this.fileDeleted.emit(event);
                    this.cdr.detectChanges();
                  })
                )
              : of(null)
          )
        )
        .subscribe();
  };

  handleFilesUpload = (event: IFileInfo[]) => {
    if (!event.length) return;

    const files = [...event];
    for (let i = 0; i < files.length; i++) {
      files[i] = {
        ...files[i],
        ...this.additionalInfo,
        code: this.code,
        page: this.page,
      };
    }

    this.service
      .upload(files)
      .pipe(take(1))
      .subscribe((x) => {
        this.snackbar.open('Данные успешно загружены');
        this.filesUploaded.emit(x);
        this.files = [...this.files, ...x];
        this.cdr.detectChanges();
      });
  };
}
