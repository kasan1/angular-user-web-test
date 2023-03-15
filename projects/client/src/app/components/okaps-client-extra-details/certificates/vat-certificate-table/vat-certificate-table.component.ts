import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { IDocument } from 'projects/okaps/src/app/models/client.model';
import {
  removeCertificate,
  removeLicense,
} from 'projects/okaps/src/app/store/client.extra';
import { IOkapsAppState } from 'projects/okaps/src/app/store/okaps';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { VatCertificateDialogFormComponent } from '../vat-certificate-dialog-form/vat-certificate-dialog-form.component';

@Component({
  selector: 'app-vat-certificate-table',
  templateUrl: './vat-certificate-table.component.html',
  styleUrls: ['./vat-certificate-table.component.scss'],
})
export class VatCertificateTableComponent implements OnInit {
  @Input() isReadOnly: boolean;
  @ViewChild(MatSort) sort: MatSort;

  ngDestroyed$ = new Subject();
  dataSource: MatTableDataSource<any>;
  certificate: IDocument = null;

  displayedColumns: string[] = ['numberAndIssueDate', 'issuer', 'actions'];

  constructor(
    private store: Store<IOkapsAppState>,
    private dialogService: MatDialog
  ) {}

  ngOnInit(): void {
    this.store
      .select(
        (state: IOkapsAppState) => state.clientExtraDetails.vatCertificate
      )
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((data) => {
        this.certificate = data;

        const tableDate = [];
        if (this.certificate !== null) {
          tableDate.push({
            numberAndIssueDate: `${this.certificate.number}, ${
              new Date(this.certificate.dateIssue).toISOString().split('T')[0]
            }`,
            issuer: this.certificate.issuer,
          });
        }

        this.dataSource = new MatTableDataSource(tableDate);
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  addCertificate() {
    if (this.isReadOnly) return;

    this.dialogService.open(VatCertificateDialogFormComponent, {
      data: {
        initialData: null,
      },
    });
  }

  editCertificate() {
    if (this.isReadOnly) return;

    this.dialogService.open(VatCertificateDialogFormComponent, {
      data: {
        initialData: this.certificate,
      },
    });
  }

  removeCertificate() {
    if (this.isReadOnly) return;

    this.store.dispatch(removeCertificate());
  }
}
