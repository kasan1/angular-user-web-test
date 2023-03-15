import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Injector,
  NgModule,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { formatDate } from '@angular/common';
import { map, take } from 'rxjs/operators';
import NCALayerFunctionality from 'projects/shared/util/ncaLayer';
import { SharedModule } from 'projects/shared/shared.module';
import { AgreementService } from '../../../services/agreement.service';
import { AgreementType } from 'projects/shared/models/agreementType';
import { noop } from 'rxjs/internal/util/noop';
import { Subscription } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-agreement',
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.scss'],
})
export class LazyAgreementComponent
  extends NCALayerFunctionality
  implements OnInit
{
  dateNow: string;
  loading: boolean;

  ncaLayerSubscription: Subscription = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IRegisterAgreementData,
    private ref: MatDialogRef<LazyAgreementComponent>,
    private cdr: ChangeDetectorRef,
    private service: AgreementService,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.dateNow = formatDate(new Date(), 'dd.MM.yyyy', 'en');

    this.loading$.subscribe(
      (loading) => {
        this.loading = loading;
        this.cdr.detectChanges();
      },
      () => (this.loading = false)
    );
  }

  sign = () => {
    const xml = document.getElementById('application').innerHTML;

    if (this.ncaLayerSubscription !== null) {
      this.ncaLayerSubscription.unsubscribe();
    }

    this.ncaLayerSubscription = this.openLayer$(() => this.signXml(xml))
      .pipe(
        map((data) => {
          const { code, responseObject } = data;
          if (code === '200') {
            this._extractValues(responseObject);
          }
        })
      )
      .subscribe(noop, () => this.setLoading(false));
  };

  _extractValues = (responseObject: any) =>
    this.service
      .addAgreement({
        signedXml: responseObject,
        agreementType: AgreementType.Universal,
      })
      .pipe(
        take(1),
        map((response) => this.ref.close(response.data))
      )
      .subscribe(noop, () => this.setLoading(false));
}

interface IRegisterAgreementData {
  firstName: string;
  lastName: string;
  middleName: string;
  iin: string;
}

@NgModule({
  declarations: [LazyAgreementComponent],
  imports: [SharedModule],
})
class AgreementModule {}
