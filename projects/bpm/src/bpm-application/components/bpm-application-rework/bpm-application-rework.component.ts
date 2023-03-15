import {
  Component,
  ChangeDetectionStrategy,
} from '@angular/core';
import { fadeInTrigger, fadeInOutTrigger } from 'projects/shared/util/triggers';
import { BehaviorSubject } from 'rxjs';
import { BpmFileService } from 'projects/bpm/src/app/services/bpm-file.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { IBpmAppState } from 'projects/bpm/src/app/store/bpm';
import { BpmPledgeService } from '../../services/bpm-pledge.service';
import { IJuristResult, IJuristComment } from 'projects/shared/services/jurist.service';
import { BpmApplicationComponent } from '../bpm-application/bpm-application.component';
import { BpmApplicationService } from '../../services/bpm-application.service';
import { BPMCommitteeService } from '../../services/bpm-committee.service';
import { BpmJuristService } from '../../services/bpm-jurist.service';



@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bpm-application-rework',
  templateUrl: './bpm-application-rework.component.html',
  styleUrls: ['./bpm-application-rework.component.scss'],
  animations: [fadeInTrigger, fadeInOutTrigger],
})
export class BpmApplicationReworkComponent extends BpmApplicationComponent {

  _route: ActivatedRoute;
  _servicePledge: BpmPledgeService;

  juristResults$ = new BehaviorSubject<IJuristResult[]>(null);
  juristComment$ = new BehaviorSubject<IJuristComment>(null);
  
  id: string;
  applicationTaskId: string;

  constructor(
    store: Store<IBpmAppState>,
    file: BpmFileService,
    committeeService: BPMCommitteeService,
    router: Router,
    route: ActivatedRoute,
    servicePledge: BpmPledgeService,
    service: BpmApplicationService,
    private juristService: BpmJuristService
  ) {
    super(store, file, committeeService, router, route, servicePledge, service);
    this._route = route;
  }

  ngOnInit(): void {
    this.id = this._route.snapshot.paramMap.get('id');
    this.applicationTaskId = this._route.snapshot.paramMap.get('applicationTaskId');
    super.ngOnInit();
    this._loadJuristComment();
    this._loadJuristResults();
  }

  _loadJuristResults = () => {
    this.juristService
      .getJuristResults(this.id)
      .pipe()
      .subscribe((x) => {
        this.juristResults$.next(x);
      });
  };

  _loadJuristComment = () => {
    this.juristService
      .getJuristComment(this.id)
      .pipe()
      .subscribe((x) => {
        this.juristComment$.next(x);
      });
  };

  _hasUnFixedResult = () => {
    let val = this.juristResults$.getValue();
    if (val != null)
      return val.filter(x => x.isFixed == false).length > 0;
    return true;
  }
}
