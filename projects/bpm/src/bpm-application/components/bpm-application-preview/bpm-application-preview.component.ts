import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { fadeInTrigger } from 'projects/shared/util/triggers';
import { BpmApplicationService } from '../../services/bpm-application.service';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ApplicationType } from 'projects/shared/services/application.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bpm-application-preview',
  templateUrl: './bpm-application-preview.component.html',
  styleUrls: ['./bpm-application-preview.component.scss'],
  animations: [fadeInTrigger],
})
export class BpmApplicationPreviewComponent implements OnInit {
  loading$ = new Subject<boolean>();

  constructor(
    private service: BpmApplicationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {}

  startApplication = () => {
    const id = this.route.snapshot.paramMap.get('id');
    const applicationTaskId = this.route.snapshot.paramMap.get('applicationTaskId');
    if (!id) return;

    this.loading$.next(true);

    this.service
      //.setStatus(id, ApplicationType.CMInWork)
      .claimUser(applicationTaskId)
      .pipe(take(1))
      .subscribe(
        () => {
          this.loading$.next(false);
          this.router.navigate([`/application/inWork/${id}/${applicationTaskId}`], {
            replaceUrl: true,
          });
        },
        () => this.loading$.next(false)
      );
  };
}
