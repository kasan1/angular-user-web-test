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
import { MatExpansionModule } from '@angular/material/expansion';
import { Observable } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'application-check-status',
  templateUrl: './application-check-status.component.html',
  styleUrls: ['./application-check-status.component.scss'],
})
export class LazyApplicationCheckStatusComponent extends NCALayerFunctionality
  implements OnInit {
  dateNow: string;
  loading: boolean;  

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ApplicationCheckStatusModule,
    private ref: MatDialogRef<LazyApplicationCheckStatusComponent>,
    private cdr: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit(): void {
    
  }

  checkFinAnalysis(): void {
    this.data.delegate.subscribe();
  }
}

@NgModule({
  declarations: [LazyApplicationCheckStatusComponent],
  imports: [SharedModule, MatExpansionModule],
})

class ApplicationCheckStatusModule {
    id: number;
    number: number;
    clientFullName: string;
    iin: string;
    statusTitle: string;
    dateCreated: Date;
    delegate: Observable<any>;
}
