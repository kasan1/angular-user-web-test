import { Component, OnInit, ChangeDetectionStrategy, Input,} from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { fadeInTrigger } from 'projects/shared/util/triggers';
import { take, map } from 'rxjs/operators';
import { ICreditCommitteeDecision } from 'projects/shared/services/committee.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bpm-application-committee-result',
  templateUrl: './bpm-application-committee-result.component.html',
  styleUrls: ['./bpm-application-committee-result.component.scss'],
  animations: [fadeInTrigger],
})
export class BpmApplicationСommitteeResultComponent implements OnInit {
  @Input('сommitteeDecision') x: ICreditCommitteeDecision[];

  сommitteeDecision$ = new BehaviorSubject<ICreditCommitteeDecision[]>(null);
  loading$ = new Subject<boolean>();

  constructor(
  ) {}

  ngOnInit(): void {
    this._initialize();
  }

  _initialize = () => {
      
  };
}
