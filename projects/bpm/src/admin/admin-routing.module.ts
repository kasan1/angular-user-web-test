import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BpmAdminRegisterComponent } from './components/bpm-admin-register/bpm-admin-register.component';
import { BpmAdminHomeComponent } from './components/bpm-admin-home/bpm-admin-home.component';

export const routes: Routes = [
  {
    path: '',
    component: BpmAdminHomeComponent,
  },
  {
    path: 'register',
    component: BpmAdminRegisterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
