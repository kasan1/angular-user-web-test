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
import { MatExpansionModule } from '@angular/material/expansion';
import { IBranchAddress } from 'projects/shared/models/clientProfile';
import { ApplicationStatusService } from '../../../services/applicationStatus.service';
import { environment } from 'projects/okaps/src/environments/environment';
import { IFinAnalysisClient } from 'projects/shared/services/finAnalysis.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-application-compleete',
  templateUrl: './application-compleete.component.html',
  styleUrls: ['./application-compleete.component.scss'],
})
export class LazyApplicationCompleeteComponent
  extends NCALayerFunctionality
  implements OnInit
{
  dateNow: string;
  loading: boolean;

  private url = `${environment.sharedUrl}`;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ApplicationCompleeteModule,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.dateNow = formatDate(new Date(), 'dd.MM.yyyy', 'en');
  }

  downloadDocs = () => {
    window.open(`${this.url}/File/DownloadListOfDocuments`, '_blank');
  };
}

@NgModule({
  declarations: [LazyApplicationCompleeteComponent],
  imports: [SharedModule, MatExpansionModule],
})
class ApplicationCompleeteModule {
  id: number;
  number: number;
  clientFullName: string;
  iin: string;
  statusTitle: string;
  dateCreated: Date;
  closeResult: boolean;
  branch: IBranchAddress;
  finAnalysis: IFinAnalysisClient;
}
