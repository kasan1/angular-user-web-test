import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { IList, IResponse } from '../../../models/common.model';
import { INotification } from '../../../models/notification.model';
import { NotificationsService } from '../../../services/notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed, void <=> *',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class NotificationsComponent implements AfterViewInit {
  displayedColumns: string[] = ['title', 'createdDate'];
  data: INotification[] = [];
  isLoading: boolean = false;
  totalCount: number = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  selectedNotification: INotification | null = null;

  constructor(
    private notificationService: NotificationsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.paginator.page
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoading = true;
          return this.notificationService
            .getNotifications(
              this.paginator.pageIndex + 1,
              this.paginator.pageSize
            )
            .pipe(catchError(() => of(null)));
        }),
        map((response: IResponse<IList<INotification>> | null) => {
          this.isLoading = false;
          if (response == null) {
            return [];
          }

          this.totalCount = response.data.count;
          this.selectedNotification = null;

          return response.data.list;
        })
      )
      .subscribe((data) => (this.data = data));

    this.cdr.detectChanges();
  }

  toggleExpandableBlock(element: INotification): void {
    this.selectedNotification =
      this.selectedNotification === element ? null : element;
  }
}
