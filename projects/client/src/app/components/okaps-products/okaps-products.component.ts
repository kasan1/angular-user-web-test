import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { IOkapsAppState } from '../../store/okaps';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fadeInOutTrigger } from 'projects/shared/util/triggers';
import { selectCreateLizingFormValues } from '../../store/selectors/lizing.selector';
import { ICreateLizingApplicationFormValues } from '../../models/lizing.model';
import { ApplicationService } from '../../services/application.service';
import { clearAllContracts } from '../../store/lizing';

@Component({
  selector: 'app-okaps-products',
  templateUrl: './okaps-products.component.html',
  styleUrls: ['./okaps-products.component.scss'],
  animations: [fadeInOutTrigger],
})
export class OkapsProductsComponent implements OnInit, OnDestroy {
  loading: boolean;
  ngDestroyed$ = new Subject();
  currentTab = 0;
  startLoadingApplications: boolean = false;

  createLizingFormData: ICreateLizingApplicationFormValues;
  applicationId: string | null = null;
  isLizingSubmitted: boolean = false;
  isPersistant: boolean = false;

  constructor(
    private applicationService: ApplicationService,
    private snackbar: MatSnackBar,
    private store: Store<IOkapsAppState>,
    public dialogService: MatDialog
  ) {}

  ngOnInit() {
    this.store
      .select((store: IOkapsAppState) => store.lizing.submitted)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((data) => (this.isLizingSubmitted = data));

    this.store
      .select((state: IOkapsAppState) => state.lizing.persistant)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((data) => {
        this.isPersistant = data;
      });

    this.store
      .select((state: IOkapsAppState) => state.lizing.applicationId)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((data) => {
        this.applicationId = data;
      });

    selectCreateLizingFormValues(this.store)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((data) => {
        this.createLizingFormData = data;
        if (
          this.isLizingSubmitted &&
          this.createLizingFormData.contracts.length > 0 &&
          !this.isPersistant
        ) {
          this.createOrUpdateLizingApplication();
        } else {
          this.startLoadingApplications = true;
        }
      });
  }

  createOrUpdateLizingApplication() {
    if (!this.isPersistant) {
      this.loading = true;
      this.applicationService
        .createLizingApplication(this.createLizingFormData)
        .then(() => {
          this.store.dispatch(clearAllContracts());
        })
        .catch((err) => {
          let message = 'Не удалось сохранить заявку. ';
          if (err && err.error && err.error.Message)
            message += `Причина: ${err.error.Message}`;

          this.snackbar.open(message, null, { duration: 7000 });
        })
        .finally(() => {
          this.loading = false;
          this.startLoadingApplications = true;
        });
    }
  }

  ngOnDestroy() {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }
}
