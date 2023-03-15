import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IOkapsAppState } from '../../store/okaps';
import {
  ICreateLizingApplicationFormValues,
  TechConditionEnum,
  LoanTypeEnum,
  ILizingContract,
  LizingType,
} from '../../models/lizing.model';
import {
  addContract,
  setHasProvisioning,
  setSubmitted,
  updateState,
} from '../../store/lizing';
import { takeUntil } from 'rxjs/operators';
import {
  selectCreateLizingFormValues,
  selectTotalSum,
} from '../../store/selectors/lizing.selector';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { OkapsLizingMessageDialogComponent } from './okaps-lizing-message-dialog/okaps-lizing-message-dialog.component';
import { ApplicationService } from '../../services/application.service';
import { convertToStoreObject } from '../../utils/lizing.utils';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Dictionary } from 'lodash';

@Component({
  selector: 'app-okaps-lizing',
  templateUrl: './okaps-lizing.component.html',
  styleUrls: ['./okaps-lizing.component.scss'],
})
export class OkapsLizingComponent implements OnInit, OnDestroy {
  @Input() loanApplicationId: string | null = null;
  @Input() openNextTab?: () => void;

  ngDestroyed$ = new Subject();

  LoanTypeEnum = LoanTypeEnum;
  TechConditionEnum = TechConditionEnum;

  dialogRef: MatDialogRef<OkapsLizingMessageDialogComponent, any>;
  loanType: LoanTypeEnum | null = null;
  techCondition: TechConditionEnum | null = null;
  readonly MAX_LOAN_SUM = 187500000;

  isLoading = false;
  isSaving = false;

  lizingContracts: string[];
  lizingContractsData: Dictionary<ILizingContract>;
  lizingTotalAmount: number;
  isPersistant: boolean;
  isReadOnly: boolean = false;

  createLizingFormData: ICreateLizingApplicationFormValues;

  constructor(
    private store: Store<IOkapsAppState>,
    private applicationService: ApplicationService,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (this.loanApplicationId !== null) {
      this.setLoanType(LoanTypeEnum.Lizing);
      this.setTechCondition(TechConditionEnum.New);

      this.isLoading = true;
      this.applicationService
        .getApplicationContracts(this.loanApplicationId)
        .then((response) => {
          const state = convertToStoreObject(
            response.data,
            this.loanApplicationId
          );
          this.store.dispatch(updateState(state));
        })
        .finally(() => {
          this.isLoading = false;
        });
    }

    this.store
      .select((state: IOkapsAppState) => state.lizing)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((data) => {
        this.lizingContracts = data.contracts;
        this.lizingContractsData = data.contractsData;
      });

    this.store
      .select((state: IOkapsAppState) => state.client.details.isReadOnly)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((data) => {
        this.isReadOnly = data ?? false;
      });

    this.store
      .select((state: IOkapsAppState) => state.lizing.persistant)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((data) => {
        this.isPersistant = data;
      });

    selectTotalSum(this.store)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((data) => {
        this.lizingTotalAmount = data;
      });

    selectCreateLizingFormValues(this.store)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((data) => {
        this.createLizingFormData = data;
      });
  }

  ngOnDestroy(): void {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  get formCanBeSubmitted(): boolean {
    return Object.keys(this.lizingContractsData).some(
      (key) => this.lizingContractsData[key].productForm !== null
    );
  }

  needsProvisionings(contractId: string): boolean {
    return this.isStandardLizing(contractId) && this.hasProvisions(contractId);
  }

  isStandardLizing(contractId: string): boolean {
    return (
      this.lizingContractsData[contractId]?.calculatorResult?.loanType ===
      LizingType.Standard
    );
  }

  hasProvisions(contractId: string): boolean {
    return this.lizingContractsData[contractId]?.hasProvisions;
  }

  toggleHasProvisioningState(contractId: string) {
    this.store.dispatch(
      setHasProvisioning({
        contractId,
        hasProvisioning: !this.hasProvisions(contractId),
      })
    );
  }

  setLoanType(loanType: LoanTypeEnum) {
    this.loanType = loanType;
  }

  setTechCondition(techCondition: TechConditionEnum) {
    this.techCondition = techCondition;
  }

  addMoreContracts() {
    this.store.dispatch(addContract());
  }

  submitLizing() {
    this.store.dispatch(setSubmitted());

    if (this.isPersistant) {
      if (this.isReadOnly) {
        this.openNextTab();
        return;
      }

      this.isSaving = true;
      this.applicationService
        .updateLizingApplication({
          contracts: this.createLizingFormData.contracts,
          applicationId: this.loanApplicationId,
        })
        .then(() => {
          this.openNextTab();
        })
        .catch((err) => {
          let message = 'Не удалось сохранить заявку. ';
          if (err && err.error && err.error.Message)
            message += `Причина: ${err.error.Message}`;

          this.snackbar.open(message, null, { duration: 7000 });
        })
        .finally(() => (this.isSaving = false));
    } else {
      this.router.navigate(['/products']);
    }
  }
}
