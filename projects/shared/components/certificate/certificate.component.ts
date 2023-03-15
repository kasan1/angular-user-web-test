import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  Injector,
  Input,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { fadeInTrigger } from '../../util/triggers';
import NCALayerFunctionality from '../../util/ncaLayer';
import { LocaleService } from '../../services/locale.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.scss'],
  animations: [fadeInTrigger],
})
export class CertificateComponent
  extends NCALayerFunctionality
  implements OnInit, OnDestroy
{
  @Input() disabled = false;
  @Output() certificateLoaded: EventEmitter<any> = new EventEmitter();
  @Output() certificateLoading: EventEmitter<boolean> = new EventEmitter();

  locale$: Observable<any>;
  layerSub: Subscription;

  _error: string;
  _expired: string;

  constructor(
    private dialog: MatDialog,
    private locale: LocaleService,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.locale$ = this.locale.certificate().pipe(
      map((messages) => {
        this._error = messages['error'];
        this._expired = messages['expired'];
        return messages;
      })
    );
  }

  certificate = () => {
    this.loading$.subscribe((l) => this.certificateLoading.next(l));

    if (this.layerSub) {
      this.layerSub.unsubscribe();
    }

    this.layerSub = this.openLayer$(() => this.authorize())
      .pipe(
        map((data) => {
          if (!data) {
            return;
          }

          const { code, responseObject } = data;

          if (code === '200' && responseObject) {
            const { certNotAfter } = responseObject;
            if (new Date() > new Date(+certNotAfter)) {
              this.dialog.open(ConfirmationDialogComponent, {
                data: {
                  title: this._error,
                  text: this._expired,
                },
              });
              return this.closeConnection();
            }

            this.certificateLoaded.emit(responseObject);
            this.closeConnection();
          }
        })
      )
      .subscribe();
  };
}
