import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'projects/okaps/src/environments/environment';
import { IAttachment } from '../../../models/common.model';
import { ApplicationService } from '../../../services/application.service';

@Component({
  selector: 'app-attachments-list',
  templateUrl: './attachments-list.component.html',
  styleUrls: ['./attachments-list.component.scss'],
})
export class AttachmentsListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = [
    'applicationNumber',
    'applicationDate',
    'documentType',
    'document',
  ];
  dataSource: MatTableDataSource<IAttachment> =
    new MatTableDataSource<IAttachment>();

  constructor(
    private applicationService: ApplicationService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAttachments();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  get fileServerRootUrl(): string {
    return environment.fileServer;
  }

  loadAttachments(): void {
    this.applicationService
      .getAllAttachments()
      .then((response) => {
        this.dataSource.data = response.data;
      })
      .catch((error) => {
        this.snackbar.open(error.error.Message, null, { duration: 3000 });
      });
  }
}
