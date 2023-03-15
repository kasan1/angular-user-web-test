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
import NCALayerFunctionality from 'projects/shared/util/ncaLayer';
import { SharedModule } from 'projects/shared/shared.module';
import { ApplicationStatusService } from '../../../services/applicationStatus.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { IFinAnalysisClient } from 'projects/shared/services/finAnalysis.service';
import {
  IClientProfile,
  IBranchAddress,
} from 'projects/shared/models/clientProfile';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-applicationStatus',
  templateUrl: './applicationStatus.component.html',
  styleUrls: ['./applicationStatus.component.scss'],
})
export class LazyApplicationStatusComponent
  extends NCALayerFunctionality
  implements OnInit
{
  dateNow: string;
  loading: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ApplicationStatusModule,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.dateNow = formatDate(new Date(), 'dd.MM.yyyy', 'en');
  }

  approve = () => {
    console.log(this.data);
  };
}

@NgModule({
  declarations: [LazyApplicationStatusComponent],
  imports: [SharedModule, MatExpansionModule],
})
class ApplicationStatusModule {
  id: number;
  number: number;
  clientFullName: string;
  iin: string;
  purpose: string;
  statusTitle: string;
  dateCreated: Date;
  finAnalysis: IFinAnalysisClient;
  profile: IClientProfile;
  branch: IBranchAddress;
}
