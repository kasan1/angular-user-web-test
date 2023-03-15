import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  IFinAnalysis,
  RejectStatuses,
} from 'projects/shared/services/finAnalysis.service';
import { fadeInTrigger } from 'projects/shared/util/triggers';
import { BpmFileService } from 'projects/bpm/src/app/services/bpm-file.service';
import { IFileInfo } from 'projects/shared/models/fileInfo';
import { take, map } from 'rxjs/operators';
import { BpmLocaleService } from 'projects/bpm/src/app/services/locale.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bpm-fin-analysis',
  templateUrl: './bpm-fin-analysis.component.html',
  styleUrls: ['./bpm-fin-analysis.component.scss'],
  animations: [fadeInTrigger],
})
export class BpmFinAnalysisComponent implements OnInit {
  @Input('finAnalysis') x: IFinAnalysis;

  finAnalysis$ = new BehaviorSubject<IFinAnalysisListEntry[]>(null);

  list$ = new BehaviorSubject<IFinAnalysisListEntry>(null);
  file$: Observable<IFileInfo>;
  locale$: Observable<any>;

  statuses = RejectStatuses;

  constructor(
    private service: BpmFileService,
    private locale: BpmLocaleService
  ) {}

  ngOnInit(): void {
    this._initialize();

    this.locale$ = this.locale.file();
  }

  expand = (e: IFinAnalysisListEntry) => {
    this.list$.next(
      this.list$.value && this.list$.value.key == e.key ? null : e
    );
  };

  _initialize = () => {
    if (!this.x) return;

    if (this.x.creditReportId)
      this.file$ = this.service.load({ id: this.x.creditReportId }).pipe(
        take(1),
        map((x) => {
          if (x && x.length) return x[0];
        })
      );

    const values = [
      { text: this.x.falseBusinessDetail, status: this.x.falseBusiness },
      { text: this.x.bankruptDetail, status: this.x.bankrupt },
      { text: this.x.wantedIncomeDetail, status: this.x.wantedIncome },
      { text: this.x.taxesBankruptDetail, status: this.x.taxesBankrupt },
      { text: this.x.inactiveDetail, status: this.x.inactive },
      { text: this.x.lostPeopleDetail, status: this.x.lostPeople },
      { text: this.x.pedophilyDetail, status: this.x.pedophily },
      { text: this.x.taxArrearDetail, status: this.x.taxArrear },
      { text: this.x.terrorListDetail, status: this.x.terrorList },
      { text: this.x.alimentDetail, status: this.x.aliment },
    ];

    this.finAnalysis$.next([
      {
        key: 1,
        title: 'Соответствие общим требованиям',
        items: values,
        overall: values.every((x) => x.status == RejectStatuses.Correct),
      },
      {
        key: 2,
        title: 'Кредитная история',
        items: [],
        overall: true,
        reportId: this.x.creditReportId,
      },
    ]);
  };
}

interface IFinAnalysisListEntry {
  key: number;
  title: string;
  items: { text: string; status: RejectStatuses }[];
  overall: boolean;
  reportId?: string;
}
