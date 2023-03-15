import { MatDividerModule } from '@angular/material/divider';
import { NgModule } from '@angular/core';
import { SharedModule } from 'projects/shared/shared.module';
import { BpmInstantFileUploadComponent } from './components/bpm-instant-file-upload/bpm-instant-file-upload.component';
import { BpmDeferredFileUploadComponent } from './components/bpm-deferred-file-upload/bpm-deferred-file-upload.component';
import { BpmClientInfoDialogComponent } from './components/bpm-client-info-dialog/bpm-client-info-dialog.component';
import { BpmFileItemComponent } from './components/bpm-file-item/bpm-file-item.component';
import { BpmFileUploadBaseComponent } from './components/bpm-file-upload-base/bpm-file-upload-base.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BpmAsonDialogComponent } from './components/bpm-ason-dialog/bpm-ason-dialog.component';
import { BpmApplicationFilesComponent } from '../bpm-application/components/bpm-application-files/bpm-application-files.component';
import { JuristResultEditComponent } from '../bpm-application/components/shared/jurist-result-edit/jurist-result-edit.component';
import { KatoSelectorComponent } from '../bpm-application/components/shared/kato-selector/kato-selector.component';
import { KatoTitleComponent } from '../bpm-application/components/shared/kato-title/kato-title.component';

@NgModule({
  declarations: [
    BpmInstantFileUploadComponent,
    BpmDeferredFileUploadComponent,
    BpmClientInfoDialogComponent,
    BpmApplicationFilesComponent,
    BpmFileItemComponent,
    BpmFileUploadBaseComponent,
    BpmAsonDialogComponent,
    JuristResultEditComponent,
    KatoSelectorComponent,
    KatoTitleComponent
  ],
  imports: [SharedModule, MatDividerModule, MatSlideToggleModule],
  exports: [
    BpmInstantFileUploadComponent,
    BpmApplicationFilesComponent,
    BpmDeferredFileUploadComponent,
    BpmClientInfoDialogComponent,
    BpmFileItemComponent,
    JuristResultEditComponent,
    KatoSelectorComponent,
    KatoTitleComponent
  ],
})
export class BpmSharedModule {}
