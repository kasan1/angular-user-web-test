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
import { AgreementType } from 'projects/shared/models/agreementType';
import { AgreementService } from 'projects/bpm/src/bpm-application/services/agreement.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-agreement',
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.scss'],
})
export class LazyAgreementComponent extends NCALayerFunctionality
  implements OnInit {
  dateNow: string;
  loading: boolean;

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
  }

  sign = () => {
    const xml = document.getElementById('application').innerHTML;

    this.loading$.subscribe((l) => {
      this.loading = l;
      this.cdr.detectChanges();
    });
    this.openLayer$(() => this.signXml(xml))
      .pipe(
        map((data) => {
          const { code, responseObject: ro } = data;
          if (code === '200') this._extractValues(ro);
        })
      )
      .subscribe();
  };

  _extractValues = (responseObject: any) =>
    this.service
      .addAgreement({
        signedXml: responseObject,
        agreementType: AgreementType.CreditCommittee,
      })
      .pipe(
        take(1),
        map((x) => this.ref.close(x))
      )
      .subscribe();
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
