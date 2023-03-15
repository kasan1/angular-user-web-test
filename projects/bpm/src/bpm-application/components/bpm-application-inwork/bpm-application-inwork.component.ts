import {
  selectBpmApp,
  selectBpmAppFiles,
} from './../../store/bpm-application.selectors';
import {
  TESTFinalCodes,
  FileCode,
} from './../../../../../shared/models/fileInfo';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { fadeInTrigger, fadeInOutTrigger } from 'projects/shared/util/triggers';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BpmApplicationFileDialogComponent } from '../bpm-application-file-dialog/bpm-application-file-dialog.component';
import { Observable, Subject, of, BehaviorSubject } from 'rxjs';
import {
  IFileInfo,
  FilePage,
  TESTFileCodes,
} from 'projects/shared/models/fileInfo';
import { BpmFileService } from 'projects/bpm/src/app/services/bpm-file.service';
import {
  take,
  finalize,
  catchError,
  tap,
  map,
  takeUntil,
} from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { BpmDialogComponent } from 'projects/bpm/src/app/components/bpm-dialog/bpm-dialog.component';
import { BpmLazyLoaderService } from 'projects/bpm/src/app/services/lazy-loader.service';
import { Store, select } from '@ngrx/store';
import { IBpmAppState } from 'projects/bpm/src/app/store/bpm';
import { loadBpmApplicationFiles } from '../../store/bpm-application.reducers';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bpm-application-inwork',
  templateUrl: './bpm-application-inwork.component.html',
  styleUrls: ['./bpm-application-inwork.component.scss'],
  animations: [fadeInTrigger, fadeInOutTrigger],
})
export class BpmApplicationInworkComponent implements OnInit, OnDestroy {
  files$ = new BehaviorSubject<IFileInfo[]>(null);
  finalFiles$: Observable<IFileInfo[]>;
  finalFilesLoading$ = new Subject<boolean>();

  finishing$ = new Subject<boolean>();
  ngDestroyed$ = new Subject();

  selectedIndex = 0;
  isParticipant = new FormControl(false);
  id: string;
  
  applicationTaskId: string;

  access = {
    0: {
      value: () => true,
      text: '',
    },
    1: {
      value: function () {
        return this.files;
      },
      files: true,
      text: '',
    },
    2: {
      value: function () {
        return this.holdings;
      },
      holdings: true,
      text: 'Необходимо добавить обеспечение',
    },
    3: {
      value: () => true,
      text: '3',
    },
    4: {
      value: () => true,
      text: '4',
    },
  };

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private service: BpmFileService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private loader: BpmLazyLoaderService,
    private store: Store<IBpmAppState>
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.applicationTaskId = this.route.snapshot.paramMap.get('applicationTaskId');
    this._loadFiles();
    this._trackFiles();

    this._loadFinalFiles();
    this._trackAccess();
  }

  documents = () =>
    this.dialog.open(BpmDialogComponent, {
      panelClass: ['d-lg'],
      hasBackdrop: true,
      disableClose: true,
      data: {
        method: this.loader.loadApplicationFinalDocuments,
      },
    });

  documentDialog = () =>
    this.dialog
      .open(BpmApplicationFileDialogComponent, {
        panelClass: ['d-lg'],
        hasBackdrop: true,
        data: {
          appId: this.id,
          page: FilePage.AppClientInformation,
          codes: TESTFileCodes(),
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

  finalDocumentDialog = () =>
    this.dialog
      .open(BpmApplicationFileDialogComponent, {
        panelClass: ['d-lg'],
        disableClose: true,
        hasBackdrop: true,
        autoFocus: true,
        data: {
          appId: this.id,
          page: FilePage.AppFinal,
          codes: TESTFinalCodes(),
        },
      })
      .afterClosed()
      .pipe(
        take(1),
        map((x) => {
          if (x) this._loadFinalFiles();
        })
      )
      .subscribe();

  next = () => {
    if (this.selectedIndex < 4) this.selectedIndex += 1;
  };

  previous = () => {
    if (this.selectedIndex > 0) this.selectedIndex -= 1;
  };

  finish = () => {
    this.router.navigate([`/application/final/${this.id}/${this.applicationTaskId}`]);
    // this.finishing$.next(true);

    // this.dialog
    //   .open(ConfirmationDialogComponent, {
    //     panelClass: ['d-lg', 'md-md', 'xl-sm'],
    //     hasBackdrop: true,
    //     data: {
    //       title: 'Подтверждение',
    //       text: 'Подтвердите отправку заявки на стадию Резюме',
    //     },
    //   })
    //   .afterClosed()
    //   .pipe(
    //     take(1),
    //     switchMap((r) =>
    //       r
    //         ? this.appService
    //             .setStatus(this.id, ApplicationType.CMFinished)
    //             .pipe(
    //               map((x) => {
    //                 if (x) {
    //                   this.router.navigate([`/application/final/${this.id}`]);
    //                   this.snackbar.open('Успешная смена статуса');
    //                 }
    //               })
    //             )
    //         : of(null)
    //     )
    //   )
    //   .subscribe(
    //     () => this.finishing$.next(false),
    //     () => this.finishing$.next(false)
    //   );
  };

  _loadFiles = () => {
    this.store.dispatch(
      loadBpmApplicationFiles({
        page: FilePage.AppClientInformation,
        appId: this.id,
      })
    );
  };

  _trackFiles = () => {
    this.store
      .pipe(
        takeUntil(this.ngDestroyed$),
        select(selectBpmAppFiles, FilePage.AppClientInformation),
        map((x) => {
          this.files$.next(x);
        })
      )
      .subscribe();
  };

  _loadFinalFiles = () => {
    this.finalFilesLoading$.next(true);
    this.finalFiles$ = this.service
      .load({
        page: FilePage.AppFinal,
        appId: this.id,
      })
      .pipe(
        take(1),
        catchError(() =>
          of(null).pipe(tap(() => this.finalFilesLoading$.next(false)))
        ),
        finalize(() => this.finalFilesLoading$.next(false))
      );
    this.cdr.detectChanges();
  };

  _trackAccess = () => {
    this.files$
      .pipe(
        takeUntil(this.ngDestroyed$),
        map((x) => {
          this.access[1].files =
            x && x.length > 0 && x.some((f) => f.code == FileCode.Passport);
          if (!this.access[1].files)
            this.access[1].text =
              'Необходимо вложить документ: Удостоверение личности';
        })
      )
      .subscribe();

    this.store
      .pipe(
        takeUntil(this.ngDestroyed$),
        select(selectBpmApp),
        map((x) => {
          this.access[2].holdings = x.holdings.items.length > 0;
          if (!this.access[2].holdings)
            this.access[2].text = 'Необходимо добавить обеспечение';
        })
      )
      .subscribe();
  };

  ngOnDestroy = () => {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  };
}
