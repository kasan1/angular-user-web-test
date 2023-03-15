import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IClientDetails } from '../../models/client.model';
import { ApplicationService } from '../../services/application.service';
import {
  clearClientDetails,
  setDetails,
  updateBooker,
  updateHead,
} from '../../store/client';
import { IOkapsAppState } from '../../store/okaps';
import { OrganisationFormComponent } from './organisation-form/organisation-form.component';
import { PersonFormComponent } from './person-form/person-form.component';

@Component({
  selector: 'app-okaps-client-details',
  templateUrl: './okaps-client-details.component.html',
  styleUrls: ['./okaps-client-details.component.scss'],
})
export class OkapsClientDetailsComponent implements OnInit, OnDestroy {
  @Input() loanApplicationId: string;
  @Input() openNextTab: () => void;

  @ViewChild(OrganisationFormComponent)
  organisationForm: OrganisationFormComponent;

  @ViewChildren(PersonFormComponent)
  personForms: QueryList<PersonFormComponent>;

  ngDestroyed$ = new Subject();

  readonly head = 'head';
  readonly booker = 'booker';
  readonly beneficiary = 'beneficiary';

  step: number = -1;
  saving: boolean = false;
  loading: boolean = true;
  details: IClientDetails = null;

  constructor(
    private store: Store<IOkapsAppState>,
    private applicationService: ApplicationService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getDetails();

    this.store
      .select((state: IOkapsAppState) => state.client.details)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((data) => {
        this.details = data;
      });
  }

  ngOnDestroy(): void {
    this.store.dispatch(clearClientDetails());
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  getDetails() {
    this.loading = true;
    this.applicationService
      .getClientDetails(this.loanApplicationId)
      .then((response) => {
        if (response.succeed) {
          this.store.dispatch(setDetails(response.data));
        }
      })
      .finally(() => (this.loading = false));
  }

  save() {
    if (this.details.isReadOnly) {
      this.openNextTab();
      return;
    }

    if (this.details.head === null) {
      return this.showErrorMessage(
        'Пожалуйста заполните все обязательные поля для руководителя'
      );
    }

    this.saving = true;
    this.applicationService
      .createClientDetails(this.loanApplicationId, this.details)
      .then(() => {
        this.openNextTab();
        this.getDetails();
      })
      .catch(this.handleErrorResponse)
      .finally(() => {
        this.saving = false;
      });
  }

  setStep(index: number) {
    this.submitCurrentStepForm();

    this.step = index;
  }

  nextStep() {
    if (this.submitCurrentStepForm()) this.step++;
  }

  prevStep() {
    this.step--;
  }

  submitCurrentStepForm(): boolean {
    if (this.details.isReadOnly) return true;

    let isValid = true;

    switch (this.step) {
      case 0:
        isValid = this.organisationForm.onFormSubmit();
        break;
      case 1:
        const headForm = this.personForms
          .toArray()
          .find((x) => x.name === this.head);

        const head = headForm.onFormSubmit();

        isValid = !!head;
        if (isValid) {
          this.store.dispatch(updateHead(head));
        }
        break;
      case 2:
        const bookerForm = this.personForms
          .toArray()
          .find((x) => x.name === this.booker);

        const booker = bookerForm.onFormSubmit();

        // isValid = !!booker; // filling booker is not required
        if (!!booker) {
          this.store.dispatch(updateBooker(booker));
        }
        break;
      case 3:
        break;
      case 4:
        break;
      default:
        break;
    }

    return isValid;
  }

  handleErrorResponse(err?: any) {
    let errorMessage = 'Не удалось сохранить данные';
    if (err) {
      if (err.error && err.error.Message) errorMessage = err.error.Message;
    }

    this.showErrorMessage(errorMessage);
  }

  showErrorMessage(message: string) {
    this.snackbar.open(message, 'Закрыть', {
      duration: 5000,
    });
  }
}
