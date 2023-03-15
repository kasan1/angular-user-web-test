import { NgModule } from '@angular/core';
import { BpmApplicationListComponent } from './components/bpm-application-list/bpm-application-list.component';
import { SharedModule } from 'projects/shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { fromBpmAppList } from './store/bpm-application-list.reducers';
import { EffectsModule } from '@ngrx/effects';
import { BpmApplicationListEffects } from './store/bpm-application-list.effects';
import { BpmApplicationListService } from './services/bpm-application-list.service';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [BpmApplicationListComponent],
  imports: [
    SharedModule,
    StoreModule.forFeature(fromBpmAppList.key, fromBpmAppList.reducer),
    EffectsModule.forFeature([BpmApplicationListEffects]),
    RouterModule.forChild([
      { path: '', component: BpmApplicationListComponent },
    ]),
  ],
  providers: [BpmApplicationListService],
})
export class BpmApplicationListModule {}
