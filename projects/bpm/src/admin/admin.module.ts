import { NgModule } from '@angular/core';
import { BpmAdminRegisterComponent } from './components/bpm-admin-register/bpm-admin-register.component';
import { BpmAdminLazyLoaderService } from './services/bpm-admin.lazy-loader.service';
import { SharedModule } from 'projects/shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { BpmAdminHomeComponent } from './components/bpm-admin-home/bpm-admin-home.component';
import { BpmAdminLocaleService } from './services/bpm-admin.locale.service';

@NgModule({
  declarations: [BpmAdminRegisterComponent, BpmAdminHomeComponent],
  imports: [SharedModule, AdminRoutingModule],
  providers: [BpmAdminLazyLoaderService, BpmAdminLocaleService],
})
export class AdminModule {}
