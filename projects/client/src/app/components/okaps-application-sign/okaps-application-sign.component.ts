import {
  Component,
  ElementRef,
  Injector,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import NCALayerFunctionality from 'projects/shared/util/ncaLayer';
import { noop, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { EntityTypeEnum, IFile, IFileUpload } from '../../models/common.model';
import { ApplicationService } from '../../services/application.service';
import { FilesService } from '../../services/files.service';
import { IOkapsAppState } from '../../store/okaps';

@Component({
  selector: 'app-okaps-application-sign',
  templateUrl: './okaps-application-sign.component.html',
  styleUrls: ['./okaps-application-sign.component.scss'],
})
export class OkapsApplicationSignComponent
  extends NCALayerFunctionality
  implements OnInit
{
  @Input() loanApplicationId: string;

  @ViewChild('attachmentFilesInput', { static: false })
  attachmentFilesInput: ElementRef;

  isReadOnly: boolean = false;

  ulFiles: IFile[] = [];
  flFiles: IFile[] = [];

  loading = false;
  signing = false;
  attachmentFiles: IFile[] = [];

  ncaLayerSubscription: Subscription = null;

  constructor(
    injector: Injector,
    private store: Store<IOkapsAppState>,
    private fileService: FilesService,
    private applicationService: ApplicationService,
    private router: Router
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.store
      .select((state: IOkapsAppState) => state.client.details.isReadOnly)
      .subscribe((data) => {
        this.isReadOnly = data ?? false;
      });

    this.fileService
      .getULFiles(this.loanApplicationId)
      .then((response) => (this.ulFiles = response.data));
    this.fileService
      .getFLFiles(this.loanApplicationId)
      .then((response) => (this.flFiles = response.data));

    this.getAttachmentFiles();
  }

  get questionaireFormUrl(): string {
    return `${environment.sharedUrl}/loanapplication/${this.loanApplicationId}/details/file`;
  }

  get applicationFormUrl(): string {
    return `${environment.sharedUrl}/loanapplication/${this.loanApplicationId}/file`;
  }

  get fileServerRootUrl(): string {
    return environment.fileServer;
  }

  getAttachmentFiles() {
    this.fileService
      .getAttachmentFiles({
        entityId: this.loanApplicationId,
        entityType: EntityTypeEnum.Personality,
      })
      .then((response) => (this.attachmentFiles = response.data));
  }

  uploadButtonClick() {
    if (this.isReadOnly) return;

    this.attachmentFilesInput.nativeElement.click();
  }

  onFileInputChange(files: FileList) {
    if (this.isReadOnly) return;

    const data: IFileUpload = {
      entityId: this.loanApplicationId,
      entityType: EntityTypeEnum.Personality,
      files: files,
    };

    this.loading = true;
    this.fileService
      .uploadFiles(data)
      .then(() => {
        this.getAttachmentFiles();
      })
      .finally(() => {
        this.attachmentFilesInput.nativeElement.value = '';
        this.loading = false;
      });
  }

  onFileDelete(fileId: string) {
    if (this.isReadOnly) return;

    this.loading = true;
    this.fileService
      .deleteFile(fileId)
      .then(() => {
        this.getAttachmentFiles();
      })
      .finally(() => {
        this.loading = false;
      });
  }

  signAndStartProcess() {
    if (this.isReadOnly) return;

    const xml = document.getElementById('application').innerHTML;

    if (this.ncaLayerSubscription !== null) {
      this.ncaLayerSubscription.unsubscribe();
    }

    this.ncaLayerSubscription = this.openLayer$(() => this.signXml(xml))
      .pipe(
        map((data) => {
          const { code, responseObject } = data;
          if (code === '200') {
            this.signing = true;
            this.applicationService
              .signAndStartProcess(this.loanApplicationId, responseObject)
              .then(() => {
                this.router.navigate(['/products']);
              })
              .finally(() => (this.signing = false));
          }
        })
      )
      .subscribe();
  }
}
