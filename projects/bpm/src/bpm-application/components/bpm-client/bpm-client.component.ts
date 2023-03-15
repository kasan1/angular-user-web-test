import { selectBpmApp } from './../../store/bpm-application.selectors';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import {
  IBpmApplicationState,
  IBpmClient,
  bpmApplicationClientChanged,
} from '../../store/bpm-application.reducers';
import { fadeInTrigger, fadeInOutTrigger } from 'projects/shared/util/triggers';
import {
  MaritalStatus,
  maritalStatusTitle,
} from 'projects/shared/models/clientProfile';
import { formatDate } from '@angular/common';
import { BpmClientInfoDialogComponent } from 'projects/bpm/src/bpm-shared/components/bpm-client-info-dialog/bpm-client-info-dialog.component';
import { take, map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { IBpmAppState } from 'projects/bpm/src/app/store/bpm';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import {
  IDictionaryItem,
  dictionaries,
} from 'projects/shared/services/dictionary.service';
import { BpmDictionaryService } from 'projects/bpm/src/app/services/dictionary.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bpm-client',
  templateUrl: './bpm-client.component.html',
  styleUrls: ['./bpm-client.component.scss'],
  animations: [fadeInTrigger, fadeInOutTrigger],
})
export class BpmClientComponent implements OnInit {
  @Input() hasActions = false;

  app$: Observable<IBpmApplicationState>;
  clientTypes: IDictionaryItem[] = [];

  constructor(
    private store: Store<IBpmAppState>,
    private dialog: MatDialog,
    private dict: BpmDictionaryService
  ) {}

  ngOnInit(): void {
    this.app$ = this.store.pipe(select(selectBpmApp));

    this.dict
      .dictionaryItems(dictionaries.dicClientType)
      .pipe(take(1))
      .subscribe((x) => (this.clientTypes = x));
  }

  marriedTitle = (x: MaritalStatus) => maritalStatusTitle(x);

  passport = (x: IBpmClient) =>
    `УД Личности: ${x.documentNumber}, ${
      x.documentBeginDate
        ? formatDate(x.documentBeginDate, 'dd.MM.yyyy', 'en')
        : null
    } - ${
      x.documentEndDate
        ? formatDate(x.documentEndDate, 'dd.MM.yyyy', 'en')
        : null
    }. ${x.documentOrganizationName}`;

  edit = () =>
    this.dialog
      .open(BpmClientInfoDialogComponent, {
        panelClass: ['d-lg'],
        autoFocus: true,
        hasBackdrop: true,
        disableClose: true,
      })
      .afterClosed()
      .pipe(
        take(1),
        map((x: IBpmClient) => {
          if (!x) return;

          const item = this.clientTypes.length
            ? this.clientTypes.find((t) => t.id == x.clientTypeId)
            : null;
          x.clientType = item ? item.nameRu : null;

          this.store.dispatch(bpmApplicationClientChanged(x));
        })
      )
      .subscribe();
}
