import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { environment } from 'projects/okaps/src/environments/environment';
import { of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { IContractListItem } from '../../../models/application.model';
import { IList, IResponse } from '../../../models/common.model';
import { ApplicationService } from '../../../services/application.service';

@Component({
  selector: 'app-contracts-list',
  templateUrl: './contracts-list.component.html',
  styleUrls: ['./contracts-list.component.scss'],
})
export class ContractsListComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'number',
    'status',
    'sum',
    'createdDate',
    'period',
    'rate',
    'description',
    'principalDebtBalance',
    'scheduleUrl',
  ];
  data: IContractListItem[] = [];
  isLoading: boolean = false;
  totalCount: number = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private applicationService: ApplicationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.paginator.page
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoading = true;
          return this.applicationService
            .getAllContracts(
              this.paginator.pageIndex + 1,
              this.paginator.pageSize
            )
            .pipe(catchError(() => of(null)));
        }),
        map((response: IResponse<IList<IContractListItem>> | null) => {
          this.isLoading = false;
          if (response == null) {
            return [];
          }

          this.totalCount = response.data.count;
          return response.data.list;
        })
      )
      .subscribe((data) => (this.data = data));

    this.cdr.detectChanges();
  }

  get fileServerRootUrl(): string {
    return environment.fileServer;
  }
}
