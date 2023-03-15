import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Dictionary } from 'lodash';
import {
  ILoanApplication,
  ILoanApplicationTableData,
} from '../../../models/application.model';
import { ApplicationService } from '../../../services/application.service';
import { OkapsComfirmDialogComponent } from '../../okaps-comfirm-dialog/okaps-comfirm-dialog.component';

@Component({
  selector: 'app-applications-list',
  templateUrl: './applications-list.component.html',
  styleUrls: ['./applications-list.component.scss'],
})
export class ApplicationsListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [
    'registerNumber',
    'createdDate',
    'status',
    'type',
    'subject',
    'sum',
    'rate',
    'actions',
  ];
  dataSource = new MatTableDataSource<ILoanApplicationTableData>();
  rowSpanData: Dictionary<number> = {};
  page: number = 0;
  pageLimit: number = 10;
  count: number = 0;
  pageSizeOptions: number[] = [5, 10, 25];
  pageEvent: PageEvent;

  dialogRef: MatDialogRef<OkapsComfirmDialogComponent, any>;

  constructor(
    private applicationService: ApplicationService,
    private snackbar: MatSnackBar,
    public dialogService: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  loadApplications(pageEvent?: PageEvent) {
    if (!!pageEvent) {
      this.page = pageEvent.pageIndex;
      this.pageLimit = pageEvent.pageSize;
    }

    this.applicationService
      .getApplications(this.page + 1, this.pageLimit)
      .then((response) => {
        this.count = response.data.count;
        this.dataSource.data = this.processResponse(response.data.list);
      })
      .catch((error) => {
        this.snackbar.open(error.error.Message, null, { duration: 3000 });
      });

    return pageEvent;
  }

  removeApplication(id: string) {
    if (this.dialogService.openDialogs.length === 0) {
      this.dialogRef = this.dialogService.open(OkapsComfirmDialogComponent, {
        width: '350px',
        data: { title: 'Вы действительно хотите удалить заявку?' },
      });

      this.dialogRef.afterClosed().subscribe((confirmed) => {
        if (confirmed) {
          this.dataSource.data = this.dataSource.data.filter(
            (s) => s.loanApplicationId !== id
          );

          this.applicationService
            .removeApplication(id)
            .then((data) =>
              this.snackbar.open(data.message, null, { duration: 3000 })
            )
            .catch((error) =>
              this.snackbar.open(error.error.Message, null, { duration: 3000 })
            )
            .finally(() => {
              if (this.dataSource.data.length === 0 && this.page !== 0) {
                this.page--;
              }

              this.loadApplications();
            });
        }
      });
    }
  }

  processResponse(response: ILoanApplication[]): ILoanApplicationTableData[] {
    const result: ILoanApplicationTableData[] = [];
    response.map((application) => {
      this.rowSpanData[application.loanApplicationId] =
        application.contracts.length;

      application.contracts.forEach((contract, index) => {
        result.push({
          loanApplicationId: index === 0 ? application.loanApplicationId : null,
          registerNumber: application.registerNumber,
          status: application.loanStatusName,
          type: application.loanTypeName,
          createdDate: application.createdDate,
          subject: [
            `${contract.technic.techProduct} ${contract.technic.techModel}`,
          ]
            .concat(
              contract.accessories.map((a) => `${a.techProduct} ${a.techModel}`)
            )
            .join(', '),
          rate: contract.calculator.rate,
          sum: contract.calculator.sum,
        });
      });
    });

    return result;
  }
}
