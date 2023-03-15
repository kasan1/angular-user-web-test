import { splitEvery } from './../../../../../../shared/store/holding/holding.selectors';
import { IBpmApplicationState } from './../../../../bpm-application/store/bpm-application.reducers';
import { selectBpmApp } from './../../../../bpm-application/store/bpm-application.selectors';
import { Observable, Subject, of, BehaviorSubject } from 'rxjs';
import {
  Component,
  OnInit,
  NgModule,
  ChangeDetectionStrategy,
} from '@angular/core';
import { SharedModule } from 'projects/shared/shared.module';
import { BpmApplicationDocumentService } from '../../../services/bpm-application-document.service';
import { IApplicationFullInformation } from 'projects/shared/services/application-document.service';
import { IBpmAppState } from '../../../store/bpm';
import { Store, select } from '@ngrx/store';
import { takeWhile, map, take, catchError, switchMap } from 'rxjs/operators';
import { fadeInTrigger } from 'projects/shared/util/triggers';
import {
  IClientProfile,
  MaritalStatus,
  maritalStatusTitle,
} from 'projects/shared/models/clientProfile';
import { ITable } from 'projects/shared/models/table';
import { IHoldingEntry } from 'projects/shared/store/holding/holdingInitial';
import { BpmPledgeService } from 'projects/bpm/src/bpm-application/services/bpm-pledge.service';
import { pledgeName } from 'projects/shared/store/holding/holding.selectors';
import { formatCurrency } from 'projects/shared/pipes/currency.pipe';
import { clientInfo } from 'projects/bpm/src/bpm-application/store/extended/bpm-application-extended.selectors';
import { BpmFileService } from '../../../services/bpm-file.service';
import { IFileInfo, FileCode } from 'projects/shared/models/fileInfo';
import { formatDate } from '@angular/common';
import { BpmDictionaryService } from '../../../services/dictionary.service';
import { dictionaries } from 'projects/shared/services/dictionary.service';
import { SortDirection } from '@angular/material/sort';
import { groupBy } from 'lodash';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bpm-application-final-documents',
  templateUrl: './bpm-application-final-documents.component.html',
  styleUrls: ['./bpm-application-final-documents.component.scss'],
  animations: [fadeInTrigger],
})
export class BpmApplicationFinalDocumentsComponent implements OnInit {
  app$: Observable<IApplicationFullInformation>;
  files$: Observable<ITable<IFileInfo>>;
  loading$ = new Subject<boolean>();

  holdings$: Observable<ITable<IHoldingEntry>>;
  bpTable$ = new BehaviorSubject<any>(null);

  constructor(
    private service: BpmApplicationDocumentService,
    private store: Store<IBpmAppState>,
    private pledgeService: BpmPledgeService,
    private dict: BpmDictionaryService,
    private file: BpmFileService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loading$.next(true);
    this.store
      .pipe(
        select(selectBpmApp),
        takeWhile((x) => !x.id, true),
        map((x) => {
          if (!x.id) return;

          this._loadApplication(x.id);
          this._loadHoldings(x);
          this._loadFiles(x.id);
        })
      )
      .subscribe();
  }

  currentDate = () => new Date();

  method = (x: number) => {
    switch (x) {
      case 1:
        return 'Аннуитетный';
      case 2:
        return 'Дифферинцированный';
      default:
        return 'Не указано';
    }
  };

  period = (x: number) => {
    switch (x) {
      case 1:
        return 'Ежемесячно';
      case 2:
        return 'Ежеквартально';
      case 3:
        return '1 раз в полгода';
      case 4:
        return '1 раз в год';
      default:
        return 'Не указано';
    }
  };

  printFiles = () => {
    const firstDocument = document.getElementById('firstDocument').innerHTML;
    const secondDocument = document.getElementById('secondDocument').innerHTML;
    let thirdDocument = '';
    const thirdDoc = document.getElementById('thirdDocument');
    if (thirdDoc) {
      thirdDocument = thirdDoc.innerHTML;

      if (this.bpTable$.value) {
        const element = document.createElement('a');
        element.href = this.bpTable$.value;
        element.target = '_blank';
        element.download = 'Таблица БП';
        element.click();
      }
    }

    const fourthDocument = document.getElementById('fourthDocument').innerHTML;

    const body = document.getElementsByTagName('body')[0];

    document.body = document.createElement('body');
    document.body.innerHTML =
      firstDocument + secondDocument + thirdDocument + fourthDocument;
    document.body.classList.add('condensed', 'p-3');

    window.print();
    document.body = body;
  };

  maritalStatus = (x: MaritalStatus) => maritalStatusTitle(x);

  contacts = (x: IClientProfile) => {
    if (!x.phone && !x.additionPhone) return 'Не указано';
    else if (x.phone && !x.additionPhone) return `${x.phone}`;
    else if (!x.phone && x.additionPhone) return `${x.additionPhone}`;

    return `${x.phone}, ${x.additionPhone}`;
  };

  _loadHoldings = (x: IBpmApplicationState) =>
    (this.holdings$ = this.pledgeService
      .loadPledges({
        column: 'Id',
        direction: 'asc',
        pageIndex: 0,
        pageSize: 100,
        applicationId: x.id,
      })
      .pipe(
        take(1),
        switchMap((p) =>
          p && p.items.length
            ? this.pledgeService.chargeesByAppId(x.id).pipe(
                take(1),
                map((c) => {
                  p.items.forEach((i) => {
                    i['nameFormatted'] = pledgeName(
                      i.firstLevel,
                      i.secondLevel,
                      i.thirdLevel
                    );
                    i['finalSumFormatted'] = formatCurrency(i.finalSum);

                    const clients =
                      c.filter((ci) => ci.basePledgeId == i.id) || [];
                    i['clientFormatted'] = clients.length
                      ? clients.map((ci) => clientInfo(ci)).join('\n\n')
                      : clientInfo(x.client);
                  });
                  p.displayedColumns = [
                    { accessor: 'nameFormatted', columnName: 'Вид' },
                    {
                      accessor: 'finalSumFormatted',
                      columnName: 'Залоговая стоимость, тенге',
                    },
                    {
                      accessor: 'clientFormatted',
                      columnName: 'Залогодатель',
                    },
                  ];
                  p.totalItems = 0;
                  return p;
                })
              )
            : of(null)
        ),
        catchError(() => of(null))
      ));

  _loadApplication = (id: string) =>
    (this.app$ = this.service.applicationFullInformation(id).pipe(
      take(1),
      map((r) => {
        this.loading$.next(false);

        this._loadBpFile(r.businessPlanFileId);
        return r;
      }),
      catchError(() => {
        this.loading$.next(false);
        return of(null);
      })
    ));

  _loadBpFile = (id: string) =>
    this.file
      .file(id)
      .pipe(
        take(1),
        map((x) => {
          const blob = new Blob([x], {
            type: 'application/pdf',
          });
          this.bpTable$.next(URL.createObjectURL(blob));
        })
      )
      .subscribe();

  _loadFiles = (id: string) =>
    (this.files$ = this.file
      .load({
        appId: id,
      })
      .pipe(
        take(1),
        switchMap((f) =>
          this.dict.dictionaryItems(dictionaries.dicFileType).pipe(
            take(1),
            map((x) => {
              x = x.filter(
                (y) => y.code != FileCode.DocumentSummary.toString()
              );
              const ungrouped = f.map((item) => {
                const type = x.find((i) => i.code == item.code.toString());
                if (!type) return null;
                return {
                  ...item,
                  dateFormatted: item.date
                    ? formatDate(item.date, 'dd.MM.yyyy', 'en')
                    : '-',
                  isOriginalFormatted: item.isOriginal ? 'Оригинал' : 'Копия',
                  numberFormatted: item.number ? item.number : '-',
                  section: type ? type.nameRu : '',
                  group: `${type ? type.nameRu : ''}${
                    item.date ? formatDate(item.date, 'dd.MM.yyyy', 'en') : ''
                  }${item.number || ''}`,
                };
              });

              const items = [];
              const grouped = groupBy(
                ungrouped.filter((u) => u != null),
                'group'
              );
              Object.keys(grouped).forEach((key) => {
                const current = grouped[key][0];
                const section = `${current.section}\n\n${grouped[key]
                  .map((g) => g.title)
                  .join('\n')}`;

                let sectionFormatted = splitEvery(section, 3);

                items.push({
                  dateFormatted: current.date
                    ? formatDate(current.date, 'dd.MM.yyyy', 'en')
                    : '-',
                  isOriginalFormatted: current.isOriginal
                    ? 'Оригинал'
                    : 'Копия',
                  section: sectionFormatted,
                  numberFormatted: current.number || '-',
                });
              });

              return {
                items,
                displayedColumns: [
                  { accessor: 'section', columnName: 'Наименование' },
                  { accessor: 'numberFormatted', columnName: 'Номер' },
                  { accessor: 'dateFormatted', columnName: 'Дата' },
                  {
                    accessor: 'isOriginalFormatted',
                    columnName: 'Оригинал/Копия',
                  },
                ],
                pageIndex: 0,
                pageSize: 0,
                totalItems: 0,
                sort: {
                  column: 'Id',
                  direction: 'asc' as SortDirection,
                },
              };
            })
          )
        )
      ));
}

@NgModule({
  declarations: [BpmApplicationFinalDocumentsComponent],
  imports: [SharedModule],
})
class BpmApplicationFinalDocumentsModule {}
