import { BpmFinAnalysisComponent } from './components/bpm-fin-analysis/bpm-fin-analysis.component';
import { NgModule } from '@angular/core';
import { SharedModule } from 'projects/shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { RouterModule } from '@angular/router';
import { fromBpmApp } from './store/bpm-application.reducers';
import { BpmApplicationComponent } from './components/bpm-application/bpm-application.component';
import { BpmApplicationPreviewComponent } from './components/bpm-application-preview/bpm-application-preview.component';
import { BpmClientComponent } from './components/bpm-client/bpm-client.component';
import { BpmApplicationInworkComponent } from './components/bpm-application-inwork/bpm-application-inwork.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { BpmApplicationFilesComponent } from './components/bpm-application-files/bpm-application-files.component';
import { BpmApplicationFileDialogComponent } from './components/bpm-application-file-dialog/bpm-application-file-dialog.component';
import { BpmSharedModule } from '../bpm-shared/bpm-shared.module';
import { BpmApplicationBaseComponent } from './components/bpm-application-base/bpm-application-base.component';
import { BpmApplicationService } from './services/bpm-application.service';
import { EffectsModule } from '@ngrx/effects';
import { BpmApplicationEffects } from './store/bpm-application.effects';
import { BpmHoldingsComponent } from './components/bpm-holdings/bpm-holdings.component';
import { BpmHoldingDialogComponent } from './components/bpm-holding-dialog/bpm-holding-dialog.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BpmPledgeService } from './services/bpm-pledge.service';
import { BpmUristComponent } from './components/bpm-urist/bpm-urist.component';
import { BpmApplicationPurposeComponent } from './components/bpm-application-purpose/bpm-application-purpose.component';
import { BpmProductDialogComponent } from './components/bpm-product-dialog/bpm-product-dialog.component';
import { BpmPledgeComponent } from './components/bpm-pledge/bpm-pledge.component';
import { BpmApplicationConditionComponent } from './components/bpm-application-condition/bpm-application-condition.component';
import { BpmFinAnalysisService } from './services/bpm-finAnalysis.service';
import { ActvisitComponent } from './components/actvisit/actvisit.component';
import { BpmApplicationFilesSettingsComponent } from './components/bpm-application-files-settings/bpm-application-files-settings.component';
import { BpmUristBossComponent } from './components/bpm-urist-boss/bpm-urist-boss.component';
import { BpmCreditCommittee } from './components/bpm-credit-committee/bpm-credit-committee.component';
import { BPMCommitteeService } from './services/bpm-committee.service';
import { BpmPledgeBossComponent } from './components/bpm-pledge-boss/bpm-pledge-boss.component';
import { BpmApplicationСommitteeResultComponent } from './components/bpm-application-committee-result/bpm-application-committee-result.component';
import { BpmApplicationReworkComponent } from './components/bpm-application-rework/bpm-application-rework.component';
import { BpmPlanService } from './services/bpm-plan.service';
import { BpmConclusionComponent } from './components/bpm-conclusion/bpm-conclusion.component';
import { BpmBpmService } from './services/bpm-bpm.service';
import { BpmJuristService } from './services/bpm-jurist.service';
import { BpmCreditAdmin } from './components/bpm-credit-admin/bpm-credit-admin.component';
import { BpmCreditAdminRemarks } from './components/bpm-credit-admin-remarks/bpm-credit-admin-remarks.component';
import { BPMCreditAdminService } from './services/bpm-credit-admin.service';
import { BpmManagerBossComponent } from './components/bpm-manager-boss/bpm-manager-boss.component';

@NgModule({
  declarations: [
    BpmApplicationComponent,
    BpmApplicationPreviewComponent,
    BpmClientComponent,
    BpmApplicationInworkComponent,
    BpmApplicationReworkComponent,
    BpmApplicationFileDialogComponent,
    BpmApplicationBaseComponent,
    BpmHoldingsComponent,
    BpmHoldingDialogComponent,
    BpmUristComponent,
    BpmApplicationPurposeComponent,
    BpmProductDialogComponent,
    BpmPledgeComponent,
    BpmApplicationConditionComponent,
    ActvisitComponent,
    BpmApplicationFilesSettingsComponent,
    BpmFinAnalysisComponent,
    BpmUristBossComponent,
    BpmCreditCommittee,
    BpmPledgeBossComponent,
    BpmApplicationСommitteeResultComponent,
    BpmConclusionComponent,
    BpmCreditAdmin,
    BpmCreditAdminRemarks,
    BpmManagerBossComponent,
  ],
  imports: [
    MatTabsModule,
    MatRadioModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    MatSliderModule,
    SharedModule,
    BpmSharedModule,
    StoreModule.forFeature(fromBpmApp.key, fromBpmApp.reducer),
    EffectsModule.forFeature([BpmApplicationEffects]),
    RouterModule.forChild([
      { path: 'view/:id', component: BpmApplicationComponent },
      {
        path: 'preview/:id/:applicationTaskId',
        component: BpmApplicationPreviewComponent,
      },
      {
        path: 'inWork/:id/:applicationTaskId',
        component: BpmApplicationInworkComponent,
      },
      {
        path: 'reWork/:id/:applicationTaskId',
        component: BpmApplicationReworkComponent,
      },
      {
        path: 'final/:id/:applicationTaskId',
        component: BpmApplicationComponent,
      },
      {
        path: 'urist/:id/:applicationTaskId',
        component: BpmUristComponent,
      },
      {
        path: 'bpmpledge/:id/:applicationTaskId',
        component: BpmPledgeComponent,
      },
      {
        path: 'actvisit/:id/:applicationTaskId',
        component: ActvisitComponent,
      },
      {
        path: 'uristboss/:id/:applicationTaskId',
        component: BpmUristBossComponent,
      },
      {
        path: 'pledgeboss/:id/:applicationTaskId',
        component: BpmPledgeBossComponent,
      },
      {
        path: 'committee/:id/:applicationTaskId',
        component: BpmCreditCommittee,
      },
      {
        path: 'conclusion/:id/:applicationTaskId',
        component: BpmConclusionComponent,
      },
      {
        path: 'creditadmin/:id/:applicationTaskId',
        component: BpmCreditAdmin,
      },
      {
        path: 'adminRemarks/:id/:applicationTaskId',
        component: BpmCreditAdminRemarks
      },
      {
        path: 'managerboss/:id/:applicationTaskId',
        component: BpmManagerBossComponent,
      },
    ]),
  ],
  providers: [
    BpmApplicationService,
    BpmPledgeService,
    BpmJuristService,
    BpmBpmService,
    BpmFinAnalysisService,
    BPMCommitteeService,
    BpmPlanService,
    BPMCreditAdminService,
  ],
})
export class BpmApplicationModule {}
