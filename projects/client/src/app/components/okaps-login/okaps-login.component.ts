import {
  Component,
  OnInit,
  OnDestroy,
  Optional,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { map, takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { IOkapsAppState } from '../../store/okaps';
import { okapsAuthSelectors } from '../../store/selectors/auth.selectors';
import { okapsAuthActions } from '../../store/auth';
import { OkapsLocaleService } from '../../services/locale.service';
import { fadeInTrigger } from 'projects/shared/util/triggers';
import { iinValidator } from 'projects/shared/validators/iin.validator';
import { ICreateLizingApplicationFormValues } from '../../models/lizing.model';
import { selectCreateLizingFormValues } from '../../store/selectors/lizing.selector';
import { ApplicationService } from '../../services/application.service';
import { clearAllContracts } from '../../store/lizing';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-okaps-login',
  templateUrl: './okaps-login.component.html',
  styleUrls: ['./okaps-login.component.scss'],
  animations: [fadeInTrigger],
})
export class OkapsLoginComponent implements OnInit, OnDestroy {
  form: FormGroup;
  ngDestroyed$ = new Subject();
  locale$: Observable<any>;
  loading$: Observable<boolean>;

  _loginMessage: string;
  createLizingFormData: ICreateLizingApplicationFormValues;
  isLizingSubmitted: boolean = false;

  loadingState = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private route: ActivatedRoute,
    private store: Store<IOkapsAppState>,
    private locale: OkapsLocaleService,
    private applicationService: ApplicationService,
    @Optional() public ref: MatDialogRef<OkapsLoginComponent>
  ) {}

  ngOnInit() {
    this._initializeForm();
    this.loading$ = this.store.pipe(
      select(okapsAuthSelectors.selectAuth),
      map((auth) => auth.loading)
    );
    this.locale$ = this.locale.login().pipe(
      map((x) => {
        this._loginMessage = x['loginMessage'];
        return x;
      })
    );

    selectCreateLizingFormValues(this.store)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((data) => {
        this.createLizingFormData = data;
      });

    this.store
      .select((store: IOkapsAppState) => store.lizing.submitted)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((data) => (this.isLizingSubmitted = data));
  }

  submit = () => {
    if (!this.form.valid) return;

    try {
      this.loadingState = true;
      this.store.dispatch(okapsAuthActions.loggingIn());
      this.store.dispatch(okapsAuthActions.login(this.form.value));
      this.store
        .pipe(
          takeUntil(this.ngDestroyed$),
          select(okapsAuthSelectors.selectUser),
          map((user) => {
            if (user) {
              this.createLizingApplication();
            }
          })
        )
        .subscribe();
    } finally {
      this.loadingState = false;
    }
  };

  createLizingApplication() {
    if (
      this.isLizingSubmitted &&
      this.createLizingFormData.contracts.length > 0
    ) {
      this.applicationService
        .createLizingApplication(this.createLizingFormData)
        .then(() => {
          this.store.dispatch(clearAllContracts());

          this.redirect();
        })
        .catch((err) => {
          let message = 'Не удалось сохранить заявку. ';
          if (err && err.error && err.error.Message)
            message += `Причина: ${err.error.Message}`;

          this.snackbar.open(message, null, { duration: 7000 });
        });
    } else {
      this.redirect();
    }
  }

  redirect() {
    if (this.route.snapshot.queryParamMap.has('returnUrl')) {
      if (this.ref) this.ref.close();

      this.router.navigate([
        this.route.snapshot.queryParamMap.get('returnUrl'),
      ]);
    } else {
      if (this.ref) this.ref.close();
      else this.router.navigate(['/']);
    }
  }

  login = () => this.form.get('login');

  _initializeForm = () => {
    this.form = this.fb.group({
      login: ['', iinValidator()],
      password: ['', Validators.required],
    });
  };

  ngOnDestroy() {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }
}
