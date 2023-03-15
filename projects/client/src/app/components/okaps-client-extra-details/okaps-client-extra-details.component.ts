import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IClientExtraDetails } from '../../models/client.model';
import { ApplicationService } from '../../services/application.service';
import {
  clearClientExtraDetails,
  setClientExtraDetails,
} from '../../store/client.extra';
import { IOkapsAppState } from '../../store/okaps';

@Component({
  selector: 'app-okaps-client-extra-details',
  templateUrl: './okaps-client-extra-details.component.html',
  styleUrls: ['./okaps-client-extra-details.component.scss'],
})
export class OkapsClientExtraDetailsComponent implements OnInit {
  @Input() loanApplicationId: string;
  @Input() openNextTab: () => void;

  ngDestroyed$ = new Subject();

  clientExtraDetails: IClientExtraDetails;

  isReadOnly: boolean = true;
  isJuridical: boolean = true;
  hasLicenses: boolean = true;
  hasVatCertificate: boolean = true;

  saving: boolean = false;
  loading: boolean = false;

  constructor(
    private store: Store<IOkapsAppState>,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.getClientExtraDetails();

    this.store
      .select((state: IOkapsAppState) => state.clientExtraDetails.isReadOnly)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((data) => {
        this.isReadOnly = data;
      });

    this.store
      .select((state: IOkapsAppState) => state.clientExtraDetails)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((data) => {
        this.clientExtraDetails = data;
      });
  }

  ngOnDestroy(): void {
    this.store.dispatch(clearClientExtraDetails());
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  getClientExtraDetails(): void {
    this.loading = true;
    this.applicationService
      .getClientExtraDetails(this.loanApplicationId)
      .then((response) => {
        this.store.dispatch(setClientExtraDetails(response.data));
      })
      .finally(() => {
        this.loading = false;

        this.isJuridical = this.clientExtraDetails.ulOwners?.length > 0;
        this.hasLicenses = this.clientExtraDetails.licenses.length > 0;
        this.hasVatCertificate =
          this.clientExtraDetails.vatCertificate !== null;
      });
  }

  save() {
    if (this.isReadOnly) {
      this.openNextTab();
      return;
    }

    this.saving = true;

    this.applicationService
      .addOrUpdateClientExtraDetails(this.loanApplicationId, {
        id: this.clientExtraDetails.id,
        isReadOnly: this.clientExtraDetails.isReadOnly,
        flOwners: !this.isJuridical ? this.clientExtraDetails.flOwners : [],
        ulOwners: this.isJuridical ? this.clientExtraDetails.ulOwners : [],
        licenses: this.hasLicenses ? this.clientExtraDetails.licenses : [],
        vatCertificate: this.hasVatCertificate
          ? this.clientExtraDetails.vatCertificate
          : null,
      })
      .then(() => {
        this.openNextTab();
        this.getClientExtraDetails();
      })
      .finally(() => (this.saving = false));
  }
}
