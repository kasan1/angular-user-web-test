import { Component, NgModule, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { map } from 'rxjs/operators';
import { BehaviorSubject, noop, Observable, Subscription } from 'rxjs';
import { MatStepper } from '@angular/material/stepper';
import { formatDate } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fadeInTrigger } from 'projects/shared/util/triggers';
import { OkapsAuthService } from '../../../services/auth.service';
import { passwordValidator } from 'projects/shared/validators/password.validator';
import { parseResponseObject } from 'projects/shared/util/ncaLayer.helpers';
import { SharedModule } from 'projects/shared/shared.module';
import { OkapsLocaleService } from '../../../services/locale.service';
import { OkapsDialogComponent } from '../../../components/okaps-dialog/okaps-dialog.component';
import { OkapsLazyLoaderService } from '../../../services/lazy-loader.service';
import { iinValidator } from 'projects/shared/validators/iin.validator';

@Component({
  selector: 'app-okaps-register',
  templateUrl: './okaps-register.component.html',
  styleUrls: ['./okaps-register.component.scss'],
  animations: [fadeInTrigger],
})
export class LazyOkapsRegisterComponent implements OnInit {
  private loading$$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  loading$ = this.loading$$.asObservable();

  certLoading: boolean = false;
  registerForm: FormGroup;
  certificateForm: FormGroup;
  selectedIndex: number;

  personalDataUsage = new FormControl(false);

  locale$: Observable<any>;

  _successMessage: string;
  _personalDataUsageMessage: string;

  agreementSubsciption: Subscription = null;
  registerSubsciption: Subscription = null;

  constructor(
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private authService: OkapsAuthService,
    private locale: OkapsLocaleService,
    private ref: MatDialogRef<LazyOkapsRegisterComponent>,
    private dialog: MatDialog,
    private loader: OkapsLazyLoaderService
  ) {}

  ngOnInit() {
    this._initializeForms();
    this.locale$ = this.locale.register().pipe(
      map((x) => {
        this._successMessage = x['success'];
        this._personalDataUsageMessage = x['personalDataUsage'];
        return x;
      })
    );
  }

  _setLoading(state: boolean) {
    this.loading$$.next(state);
  }

  _agreement = () => {
    if (this.agreementSubsciption !== null) {
      this.agreementSubsciption.unsubscribe();
    }

    this.agreementSubsciption = this.dialog
      .open(OkapsDialogComponent, {
        disableClose: true,
        hasBackdrop: true,
        autoFocus: true,
        panelClass: ['d-lg', 'xl-md'],
        data: {
          method: this.loader.loadAgreementComponent,
          iin: this.iin().value,
          lastName: this.lastName().value,
          firstName: this.firstName().value,
          middleName: this.middleName().value,
        },
      })
      .afterClosed()
      .subscribe((agreementId) => {
        if (agreementId) {
          this.agreementId().setValue(agreementId);
          this.personalDataUsage.setValue(true);
        } else {
          this.personalDataUsage.setValue(false);
        }
      });
  };

  certificateLoaded = (responseObject: any, stepper: MatStepper) => {
    this.responseObject().setValue(responseObject);

    this._mapToFormValues(stepper);
  };

  register = () => {
    if (!this.personalDataUsage.value || this.agreementId().value === '')
      return this.snackbar.open(this._personalDataUsageMessage);
    if (!this.registerForm.valid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    if (this.registerSubsciption !== null) {
      this.registerSubsciption.unsubscribe();
    }

    this._setLoading(true);
    this.registerSubsciption = this.authService
      .registerUser(this.registerForm.value)
      .pipe(
        map((response) => {
          this.snackbar.open(this._successMessage);
          this.ref.close();
        })
      )
      .subscribe(noop, () => {
        this._setLoading(false);
      });
  };

  responseObject = () => this.certificateForm.get('responseObject');

  iin = () => this.registerForm.get('identifier');
  email = () => this.registerForm.get('email');
  lastName = () => this.registerForm.get('lastName');
  firstName = () => this.registerForm.get('firstName');
  middleName = () => this.registerForm.get('middleName');
  password = () => this.registerForm.get('password');
  confirmPassword = () => this.registerForm.get('confirmPassword');
  agreementId = () => this.registerForm.get('agreementId');
  certificateDateTo = () => this.registerForm.get('certificateDateTo');
  certificateDateFrom = () => this.registerForm.get('certificateDateFrom');
  certificateDateRange = () => {
    const from = this.certificateDateFrom().value;
    const to = this.certificateDateTo().value;
    return from && to
      ? `${formatDate(from, 'dd/MM/yy', 'en')} - ${formatDate(
          to,
          'dd/MM/yy',
          'en'
        )}`
      : '';
  };

  _initializeForms = () => {
    this.certificateForm = this.fb.group({
      responseObject: ['', Validators.required],
    });

    this.registerForm = this.fb.group({
      identifier: ['', iinValidator()],
      lastName: [''],
      firstName: ['', Validators.required],
      middleName: [''],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      password: ['', passwordValidator(8)],
      confirmPassword: ['', Validators.required],
      certificateDateFrom: ['', Validators.required],
      certificateDateTo: ['', Validators.required],
      essenceType: ['', Validators.required],
      agreementId: ['', Validators.required],
    });
  };

  _mapToFormValues = (stepper: MatStepper) => {
    const values = parseResponseObject(this.responseObject().value);
    this.registerForm.patchValue(values);

    if (this.responseObject().valid && stepper) stepper.next();
  };
}

@NgModule({
  declarations: [LazyOkapsRegisterComponent],
  imports: [SharedModule],
})
class RegisterModule {}
