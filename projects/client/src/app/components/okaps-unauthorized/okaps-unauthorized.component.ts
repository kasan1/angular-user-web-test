import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { removeContainer, addContainer } from 'projects/shared/util/container';
import { Observable } from 'rxjs';
import { OkapsLocaleService } from '../../services/locale.service';
import { OkapsLazyLoaderService } from '../../services/lazy-loader.service';
import { LocaleSignal } from 'projects/shared/services/locale.service';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { OkapsDialogComponent } from '../okaps-dialog/okaps-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-okaps-unauthorized',
  templateUrl: './okaps-unauthorized.component.html',
  styleUrls: ['./okaps-unauthorized.component.scss'],
})
export class OkapsUnauthorizedComponent implements OnInit, OnDestroy {
  locale$: Observable<any>;
  currentLocale$: Observable<string>;

  constructor(
    private locale: OkapsLocaleService,
    private dialog: MatDialog,
    private loader: OkapsLazyLoaderService
  ) {}

  ngOnInit(): void {
    removeContainer();
    this.currentLocale$ = LocaleSignal.signal$;
  }

  register = () => {
    this.dialog.open(OkapsDialogComponent, {
      hasBackdrop: true,
      disableClose: true,
      autoFocus: false,
      panelClass: ['d-lg', 'sm-lg', 'md-lg', 'lg-md'],
      data: {
        method: this.loader.loadOkapsRegisterComponent,
      },
    });
  };

  switchLocale = (event: MatButtonToggleChange) =>
    this.locale.switchLocale(event.value);

  ngOnDestroy() {
    addContainer();
  }
}
