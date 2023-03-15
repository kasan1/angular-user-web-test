import {
  Component,
  OnInit,
  Inject,
  AfterViewInit,
  Injector,
  ViewChild,
  ViewContainerRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { fadeInOutTrigger } from 'projects/shared/util/triggers';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-bpm-dialog',
  templateUrl: './bpm-dialog.component.html',
  styleUrls: ['./bpm-dialog.component.scss'],
  animations: [fadeInOutTrigger],
})
export class BpmDialogComponent implements OnInit, AfterViewInit {
  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;

  loading$ = new BehaviorSubject(true);

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private injector: Injector,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    if (!this.data.method)
      return this._log("Dialog's data has no 'method' property");

    this.data
      .method(this.container, this.injector)
      .then(() => this.loading$.next(false))
      .catch((ex: any) => {
        this._log('Не удалось загрузить компонент');
        throw new Error(ex);
      });
  }

  _log = (message: string) => {
    this.snackbar.open(message, 'Продолжить', { duration: 10000 });
  };
}
