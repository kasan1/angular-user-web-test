import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IAssets } from '../../models/assets.model';
import { ApplicationService } from '../../services/application.service';
import { clearAssets, setAssets } from '../../store/assets';
import { IOkapsAppState } from '../../store/okaps';

@Component({
  selector: 'app-okaps-client-assets',
  templateUrl: './okaps-client-assets.component.html',
  styleUrls: ['./okaps-client-assets.component.scss'],
})
export class OkapsClientAssetsComponent implements OnInit, OnDestroy {
  @Input() loanApplicationId: string;
  @Input() openNextTab: () => void;

  ngDestroyed$ = new Subject();

  assets: IAssets;

  isReadOnly: boolean = true;
  hasLandAssets: boolean;
  hasLiveStockAssets: boolean;
  hasFloraAssets: boolean;
  hasTechnicAssets: boolean;

  saving: boolean = false;
  loading: boolean = true;

  constructor(
    private store: Store<IOkapsAppState>,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.getAssets();

    this.store
      .select((state: IOkapsAppState) => state.client.details.isReadOnly)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((data) => {
        this.isReadOnly = data;
      });

    this.store
      .select((state: IOkapsAppState) => state.assets)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((data) => {
        this.assets = data;
      });
  }

  ngOnDestroy(): void {
    this.store.dispatch(clearAssets());
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  getAssets(): void {
    this.loading = true;
    this.applicationService
      .getAssets(this.loanApplicationId)
      .then((response) => {
        this.store.dispatch(setAssets(response.data));
      })
      .finally(() => {
        this.loading = false;

        this.hasLandAssets = this.assets.landActivities.length > 0;
        this.hasLiveStockAssets = this.assets.livestockActivities.length > 0;
        this.hasFloraAssets = this.assets.floraActivities.length > 0;
        this.hasTechnicAssets = this.assets.technicActivities.length > 0;
      });
  }

  save() {
    if (this.isReadOnly) {
      this.openNextTab();
      return;
    }

    this.saving = true;

    this.applicationService
      .addOrUpdateAssets(this.loanApplicationId, {
        id: this.assets.id,
        landActivities: this.hasLandAssets ? this.assets.landActivities : [],
        livestockActivities: this.hasLiveStockAssets
          ? this.assets.livestockActivities
          : [],
        floraActivities: this.hasFloraAssets ? this.assets.floraActivities : [],
        technicActivities: this.hasTechnicAssets
          ? this.assets.technicActivities
          : [],
      })
      .then(() => {
        this.openNextTab();
        this.getAssets();
      })
      .finally(() => (this.saving = false));
  }
}
