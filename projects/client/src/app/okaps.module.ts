import { NgModule } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatListModule } from '@angular/material/list';
import {
  MatDialogModule,
  MAT_DIALOG_DEFAULT_OPTIONS,
} from '@angular/material/dialog';
import { NgxMaskModule, IConfig } from 'ngx-mask';

import { OkapsRoutingModule } from './okaps-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MatSelectModule } from '@angular/material/select';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { okapsReducers } from './store/okaps';
import { OkapsAuthEffects } from './store/effects/auth.effects';
import { ApplicationsEffects } from './store/effects/applications.effects';
import { SharedModule } from 'projects/shared/shared.module';
import { OkapsUnauthorizedComponent } from './components/okaps-unauthorized/okaps-unauthorized.component';
import { OkapsLoginComponent } from './components/okaps-login/okaps-login.component';
import { OkapsNavigationComponent } from './components/okaps-navigation/okaps-navigation.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { OkapsJwtInterceptor } from './services/jwt.interceptor.service';
import { OkapsErrorInterceptor } from './services/error.interceptor.service';
import { OkapsProductsComponent } from './components/okaps-products/okaps-products.component';
import { OkapsDialogComponent } from './components/okaps-dialog/okaps-dialog.component';
import { OkapsApplicationComponent } from './components/okaps-application/okaps-application.component';
import { ExcelService } from './services/ExcelService';
import { Resolver } from './resolver';
import { OkapsLizingComponent } from './components/okaps-lizing/okaps-lizing.component';
import { OkapsLizingFormComponent } from './components/okaps-lizing/okaps-lizing-form/okaps-lizing-form.component';
import { OkapsLizingTableComponent } from './components/okaps-lizing/okaps-lizing-table/okaps-lizing-table.component';
import { OkapsLizingCalculatorComponent } from './components/okaps-lizing/okaps-lizing-calculator/okaps-lizing-calculator.component';
import { OkapsLizingEditDialogComponent } from './components/okaps-lizing/okaps-lizing-edit-dialog/okaps-lizing-edit-dialog.component';
import { OkapsLizingFormBaseComponent } from './components/okaps-lizing/okaps-lizing-form-base/okaps-lizing-form-base.component';
import { MatSortModule } from '@angular/material/sort';
import { AmountConverterPipe } from './pipes/amount.pipe';
import { OkapsLizingMessageDialogComponent } from './components/okaps-lizing/okaps-lizing-message-dialog/okaps-lizing-message-dialog.component';
import { OkapsClientDetailsComponent } from './components/okaps-client-details/okaps-client-details.component';
import { OrganisationFormComponent } from './components/okaps-client-details/organisation-form/organisation-form.component';
import { PersonFormComponent } from './components/okaps-client-details/person-form/person-form.component';
import { CreditHistoryTableComponent } from './components/okaps-client-details/credit-history-table/credit-history-table.component';
import { CreditHistoryDialogFormComponent } from './components/okaps-client-details/credit-history-dialog-form/credit-history-dialog-form.component';
import { AffilatedCompaniesTableComponent } from './components/okaps-client-details/affilated-companies-table/affilated-companies-table.component';
import { AffilatedCompaniesDialogFormComponent } from './components/okaps-client-details/affilated-companies-dialog-form/affilated-companies-dialog-form.component';
import { OkapsClientAssetsComponent } from './components/okaps-client-assets/okaps-client-assets.component';
import { LandAssetsTableComponent } from './components/okaps-client-assets/land-assets/land-assets-table/land-assets-table.component';
import { LandAssetsDialogFormComponent } from './components/okaps-client-assets/land-assets/land-assets-dialog-form/land-assets-dialog-form.component';
import { LivestockAssetsTableComponent } from './components/okaps-client-assets/livestock-assets/livestock-assets-table/livestock-assets-table.component';
import { LivestockAssetsDialogFormComponent } from './components/okaps-client-assets/livestock-assets/livestock-assets-dialog-form/livestock-assets-dialog-form.component';
import { FloraAssetsTableComponent } from './components/okaps-client-assets/flora-assets/flora-assets-table/flora-assets-table.component';
import { FloraAssetsDialogFormComponent } from './components/okaps-client-assets/flora-assets/flora-assets-dialog-form/flora-assets-dialog-form.component';
import { TechnicAssetsTableComponent } from './components/okaps-client-assets/technic-assets/technic-assets-table/technic-assets-table.component';
import { TechnicAssetsDialogFormComponent } from './components/okaps-client-assets/technic-assets/technic-assets-dialog-form/technic-assets-dialog-form.component';
import { OkapsApplicationSignComponent } from './components/okaps-application-sign/okaps-application-sign.component';
import { ProvisioningTableComponent } from './components/okaps-lizing/provisioning-table/provisioning-table.component';
import { ProvisioningFormDialogComponent } from './components/okaps-lizing/provisioning-form-dialog/provisioning-form-dialog.component';
import { OkapsClientExtraDetailsComponent } from './components/okaps-client-extra-details/okaps-client-extra-details.component';
import { JuridicalOwnersTableComponent } from './components/okaps-client-extra-details/owners/juridical-owners-table/juridical-owners-table.component';
import { JuridicalOwnersDialogFormComponent } from './components/okaps-client-extra-details/owners/juridical-owners-dialog-form/juridical-owners-dialog-form.component';
import { PhysicalOwnersTableComponent } from './components/okaps-client-extra-details/owners/physical-owners-table/physical-owners-table.component';
import { PhysicalOwnersDialogFormComponent } from './components/okaps-client-extra-details/owners/physical-owners-dialog-form/physical-owners-dialog-form.component';
import { LicensesDialogFormComponent } from './components/okaps-client-extra-details/licenses/licenses-dialog-form/licenses-dialog-form.component';
import { LicensesTableComponent } from './components/okaps-client-extra-details/licenses/licenses-table/licenses-table.component';
import { VatCertificateTableComponent } from './components/okaps-client-extra-details/certificates/vat-certificate-table/vat-certificate-table.component';
import { VatCertificateDialogFormComponent } from './components/okaps-client-extra-details/certificates/vat-certificate-dialog-form/vat-certificate-dialog-form.component';
import { OkapsComfirmDialogComponent } from './components/okaps-comfirm-dialog/okaps-comfirm-dialog.component';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomPaginatorIntl } from './utils/pagination.utils';
import { ApplicationsListComponent } from './components/okaps-products/applications-list/applications-list.component';
import { AttachmentsListComponent } from './components/okaps-products/attachments-list/attachments-list.component';
import { ContactsComponent } from './components/okaps-products/contacts/contacts.component';
import { NotificationsComponent } from './components/okaps-products/notifications/notifications.component';
import { ContractsListComponent } from './components/okaps-products/contracts-list/contracts-list.component';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

@NgModule({
  declarations: [
    AppComponent,
    OkapsLoginComponent,
    OkapsNavigationComponent,
    OkapsUnauthorizedComponent,
    OkapsProductsComponent,
    OkapsDialogComponent,
    OkapsApplicationComponent,
    OkapsLizingComponent,
    OkapsLizingFormComponent,
    OkapsLizingTableComponent,
    OkapsLizingCalculatorComponent,
    OkapsLizingEditDialogComponent,
    OkapsLizingFormBaseComponent,
    AmountConverterPipe,
    OkapsLizingMessageDialogComponent,
    OkapsClientDetailsComponent,
    OrganisationFormComponent,
    PersonFormComponent,
    CreditHistoryTableComponent,
    CreditHistoryDialogFormComponent,
    AffilatedCompaniesTableComponent,
    AffilatedCompaniesDialogFormComponent,
    OkapsClientAssetsComponent,
    LandAssetsTableComponent,
    LandAssetsDialogFormComponent,
    LivestockAssetsTableComponent,
    LivestockAssetsDialogFormComponent,
    FloraAssetsTableComponent,
    FloraAssetsDialogFormComponent,
    TechnicAssetsTableComponent,
    TechnicAssetsDialogFormComponent,
    OkapsApplicationSignComponent,
    ProvisioningTableComponent,
    ProvisioningFormDialogComponent,
    OkapsClientExtraDetailsComponent,
    JuridicalOwnersTableComponent,
    JuridicalOwnersDialogFormComponent,
    PhysicalOwnersTableComponent,
    PhysicalOwnersDialogFormComponent,
    LicensesDialogFormComponent,
    LicensesTableComponent,
    VatCertificateTableComponent,
    VatCertificateDialogFormComponent,
    OkapsComfirmDialogComponent,
    ApplicationsListComponent,
    AttachmentsListComponent,
    ContactsComponent,
    NotificationsComponent,
    ContractsListComponent,
  ],
  imports: [
    SharedModule,
    HttpClientModule,
    OkapsRoutingModule,
    BrowserAnimationsModule,
    MatSelectModule,
    StoreModule.forRoot(okapsReducers),
    EffectsModule.forRoot([OkapsAuthEffects, ApplicationsEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
    }),
    MatSidenavModule,
    MatToolbarModule,
    MatButtonToggleModule,
    MatTabsModule,
    MatCardModule,
    MatSortModule,
    MatRadioModule,
    MatListModule,
    MatDialogModule,
    NgxMaskModule.forRoot(options),
  ],
  providers: [
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      },
    },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true } },
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: OkapsJwtInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: OkapsErrorInterceptor,
      multi: true,
    },
    [Resolver],
    [ExcelService],
  ],
  bootstrap: [AppComponent],
  exports: [NgxMaskModule],
})
export class OkapsModule {}
