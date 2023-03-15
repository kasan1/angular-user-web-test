import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { NgxMaskModule } from 'ngx-mask';

import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSliderModule } from '@angular/material/slider';
import { MatExpansionModule } from '@angular/material/expansion';

import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  MatMomentDateModule,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';

import { CertificateComponent } from './components/certificate/certificate.component';
import { DialogTitleComponent } from './components/dialog-title/dialog-title.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { TableComponent } from './components/table/table.component';
import { LocaleService } from './services/locale.service';
import { LoaderComponent } from './components/loader/loader.component';
import { CurrencyPipe } from './pipes/currency.pipe';
import { CurrencyInputDirective } from './directives/currency-input.directive';

const materialImports = [
  MatCardModule,
  MatIconModule,
  MatSortModule,
  MatMenuModule,
  MatInputModule,
  MatTableModule,
  MatDialogModule,
  MatSelectModule,
  MatButtonModule,
  MatStepperModule,
  MatDividerModule,
  MatCheckboxModule,
  MatSnackBarModule,
  MatPaginatorModule,
  MatFormFieldModule,
  MatDatepickerModule,
  MatMomentDateModule,
  MatProgressSpinnerModule,
  MatTooltipModule,
  MatSliderModule,
  MatExpansionModule,
  FormsModule,
  MatProgressBarModule,
];

const components = [
  ConfirmationDialogComponent,
  DialogTitleComponent,
  CertificateComponent,
  LoaderComponent,
  TableComponent,
  CurrencyPipe,
  CurrencyInputDirective,
];

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxMaskModule.forChild(),
    ...materialImports,
  ],
  exports: [
    CurrencyPipe,
    CommonModule,
    ReactiveFormsModule,
    NgxMaskModule,
    ...components,
    ...materialImports,
  ],
  providers: [
    CurrencyPipe,
    LocaleService,
    { provide: MAT_DATE_LOCALE, useValue: 'en-EN' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: ['l', 'LL'],
        },
        display: {
          dateInput: 'L',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      },
    },
  ],
})
export class SharedModule {}
