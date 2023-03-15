import { ChangeDetectorRef } from '@angular/core';
import { OnInit, Input, Output, EventEmitter, Component } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BpmFileService } from 'projects/bpm/src/app/services/bpm-file.service';
import { BpmDictionaryService } from 'projects/bpm/src/app/services/dictionary.service';
import {
  FilePage,
  IFileInfo,
} from 'projects/shared/models/fileInfo';
import { IDictionaryItem } from 'projects/shared/services/dictionary.service';

import { IJuristResult } from 'projects/shared/services/jurist.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { take } from 'rxjs/operators';
import { BpmJuristService } from '../../../services/bpm-jurist.service';
import { BpmApplicationFileDialogComponent } from '../../bpm-application-file-dialog/bpm-application-file-dialog.component';

@Component({
  selector: 'jurist-result-edit',
  templateUrl: './jurist-result-edit.component.html',
  styleUrls: ['./jurist-result-edit.component.scss'],
})
export class JuristResultEditComponent implements OnInit {
  constructor(
    private juristService: BpmJuristService,
    private dialog: MatDialog,
    private dictService: BpmDictionaryService,
    private fileService: BpmFileService,
    private cdr: ChangeDetectorRef,
    private snackbar: MatSnackBar
  ) { }
  ngOnInit(): void {
    this._loadFiles();
    this._loadDicts();
  }
  fileForm: FormGroup;
  files$: BehaviorSubject<IFileInfo[]>;
  fileTypes: IDictionaryItem[];
  filesLoading$ = new Subject<boolean>();

  @Input()
  juristResult: IJuristResult;
  @Input()
  resultNumber: number;
  @Input()
  expertPage: boolean = false;

  @Output()
  updateJuristResult: EventEmitter<IJuristResult> = new EventEmitter<
    IJuristResult
  >();

  items = () => this.fileForm.get('items') as FormArray;
  item = (i: number) => this.items().controls[i];

  deleteItem = (i: number) => this.items().removeAt(i);

  code = (i: number) => this.item(i).get('code').value;
  files = (i: number) => this.item(i).get('files');

  submit = () => {
    var reader = new FileReader();
    reader.onload = (e: any) => {
      let result: string = e.target.result;
      this.juristResult.isFixed = true;
      this.juristResult.fixFile.dataBase64 = result.substring(
        result.indexOf('base64,') + 7
      );
      this.juristService.updateJuristResult(this.juristResult).subscribe();
    };
    if (this.juristResult.fixFile && this.juristResult.fixFile.blob) {
      reader.readAsDataURL(this.juristResult.fixFile.blob);
    }
  };
  confirm = () => {
    this.juristResult.isConfirm = true;
    this.juristService.updateJuristResultConfirm(this.juristResult).subscribe();
  };

  _successResponse = (x: string) => {
    this.snackbar.open('Замечание успешно исправлено!', null, {
      duration: 2500,
    });
  };

  _loadFiles = () => {
    this.files$ = new BehaviorSubject<IFileInfo[]>([this.juristResult.fixFile]);
  };

  _loadDicts = () => {
    this.dictService.getFileTypes().subscribe(x =>
      this.fileTypes = x);
  };

  documentDialog = () => {
    this.dialog
      .open(BpmApplicationFileDialogComponent, {
        panelClass: ['d-lg'],
        hasBackdrop: true,
        disableClose: true,
        autoFocus: true,
        data: {
          appId: this.juristResult.applicationId,
          page: FilePage.All,
          codes: this.fileTypes,
          skipSave: this.juristResult.fixFile?.id ? false : true,
        },
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((x: IFileInfo[]) => {
        if (x && x.length) {
          this.juristResult.fixFile = x[0];
          this.files$ = new BehaviorSubject<IFileInfo[]>([x[0]]);
        }
      });
  }
}
