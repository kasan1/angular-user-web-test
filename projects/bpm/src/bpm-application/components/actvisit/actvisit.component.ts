import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { BpmFileService } from 'projects/bpm/src/app/services/bpm-file.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BpmApplicationFileDialogComponent } from '../bpm-application-file-dialog/bpm-application-file-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { IFileInfo, FilePage, FileCode } from 'projects/shared/models/fileInfo';
import { take, map, catchError, tap, finalize } from 'rxjs/operators';
import { Observable, Subject, of } from 'rxjs';
import { BpmJuristService } from '../../services/bpm-jurist.service';

@Component({
  selector: 'app-actvisit',
  templateUrl: './actvisit.component.html',
  styleUrls: ['./actvisit.component.scss'],
})
export class ActvisitComponent implements OnInit {
  id: string;
  applicationTaskid: string;
  fileForm: FormGroup;
  codes = [];
  page: FilePage;
  files$: Observable<IFileInfo[]>;
  filesLoading$ = new Subject<boolean>();

  loading = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: BpmFileService,
    private juristService: BpmJuristService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    // private ref: MatDialogRef<BpmApplicationFileDialogComponent>,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.applicationTaskid = this.route.snapshot.paramMap.get(
      'applicationTaskId'
    );
    this.codes = [];
    this._initializeForm();
    this._loadFiles();
  }

  saveFiles = () => {
    if (this.fileForm.invalid) return this.fileForm.markAllAsTouched();

    const result = [];

    // console.log(this.fileForm.value);

    this.items().controls.forEach((c) => {
      const files = c.get('files').value;
      if (!files.length) return;

      files.forEach((file: IFileInfo) => {
        file.code = c.get('code').value;
        file.date = c.get('date').value;
        file.number = c.get('number').value;
        file.appId = this.id;
        result.push(file);
      });
    });

    // if (this.data.skipSave) return this.ref.close(result);

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
          // this.ref.close(true);
        },
        () => this.setLoading(false)
      );
  };

  items = () => this.fileForm.get('items') as FormArray;
  item = (i: number) => this.items().controls[i];

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
      id: [''],
      code: [5],
      number: [''],
      date: [''],
      files: [[]],
      page: [FilePage.ActVisit],
    });

  _file = (blob: Blob, download: boolean) => {
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  _loadFiles = () => {
    this.filesLoading$.next(true);
    this.files$ = this.service
      .load({
        page: FilePage.ActVisit,
        appId: this.id,
      })
      .pipe(
        take(1),
        catchError(() =>
          of(null).pipe(tap(() => this.filesLoading$.next(false)))
        ),
        finalize(() => this.filesLoading$.next(false))
      );
    this.cdr.detectChanges();
  };

  documentDialog = () =>
    this.dialog
      .open(BpmApplicationFileDialogComponent, {
        panelClass: ['d-lg'],
        disableClose: true,
        hasBackdrop: true,
        autoFocus: true,
        data: {
          appId: this.id,
          page: FilePage.ActVisit,
          codes: [
            { code: FileCode.ActVisitPlan, title: 'Акт осмотра места бизнеса' },
          ],
        },
      })
      .afterClosed()
      .pipe(
        take(1),
        map((x) => {
          if (x) this._loadFiles();
        })
      )
      .subscribe();
  send = () => {
    if (false) {
      this.snackbar.open('Прекрепите "Акт осмотра места бизнеса"', null, {
        duration: 2500,
      });
    }

    this.files$.subscribe((x) => {
      if (x.length > 0) {
        this.juristService
          .submitActVisit(this.id, this.applicationTaskid)
          .subscribe(this._successResponse, () => { });
      } else {
        this.snackbar.open('Прекрепите "Акт осмотра места бизнеса"', null, {
          duration: 2500,
        });
      }
    });
  };
  _successResponse = (x: string) => {
    this.snackbar.open('Заявка успешно отправлена!', null, {
      duration: 2500,
    });
    this.router.navigate([`/applicationList`]);
  };
}
