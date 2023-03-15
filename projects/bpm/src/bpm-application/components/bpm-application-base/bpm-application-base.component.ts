import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { Observable } from 'rxjs';
import {
  IBpmApplicationState,
  loadBpmApplication,
  clearBpmApplication,
  loadBpmFinAnalysis,
  setBpmAppLoading,
} from '../../store/bpm-application.reducers';
import { Store, select } from '@ngrx/store';
import { IBpmAppState } from 'projects/bpm/src/app/store/bpm';
import { removeContainer, addContainer } from 'projects/shared/util/container';
import {
  selectBpmApp,
  selectBpmFinAnalysis,
  selectBpmAppLoading,
} from '../../store/bpm-application.selectors';
import { fadeInTrigger, fadeInOutTrigger } from 'projects/shared/util/triggers';
import { ActivatedRoute } from '@angular/router';
import { IFinAnalysis } from 'projects/shared/services/finAnalysis.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bpm-application-base',
  templateUrl: './bpm-application-base.component.html',
  styleUrls: ['./bpm-application-base.component.scss'],
  animations: [fadeInTrigger, fadeInOutTrigger],
})
export class BpmApplicationBaseComponent implements OnInit {
  @Input() purpose = true;
  @Input() finAnalysis = true;
  @Input() editClient = false;

  application$: Observable<IBpmApplicationState>;
  finAnalysis$: Observable<IFinAnalysis>;
  loading$: Observable<boolean>;

  constructor(
    private store: Store<IBpmAppState>,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    removeContainer();

    this.application$ = this.store.pipe(select(selectBpmApp));
    if (this.finAnalysis)
      this.finAnalysis$ = this.store.pipe(select(selectBpmFinAnalysis));

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loading$ = this.store.pipe(select(selectBpmAppLoading));
      this.store.dispatch(setBpmAppLoading(true));
      this.store.dispatch(loadBpmApplication(id));
      if (this.finAnalysis) this.store.dispatch(loadBpmFinAnalysis(id));
    }
  }

  ngOnDestroy() {
    addContainer();
    this.store.dispatch(clearBpmApplication());
  }
}
