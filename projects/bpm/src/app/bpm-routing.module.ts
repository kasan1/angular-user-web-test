import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BpmHomeComponent } from './components/bpm-home/bpm-home.component';
import { BpmUnauthorizedComponent } from './components/bpm-unauthorized/bpm-unauthorized.component';
import { BpmAuthGuard } from './services/auth.guard.service';

export const routes: Routes = [
  { path: '', component: BpmHomeComponent },
  { path: 'unauthorized', component: BpmUnauthorizedComponent },
  {
    path: 'admin',
    loadChildren: () =>
      import('../admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'application',
    loadChildren: () =>
      import('../bpm-application/bpm-application.module').then(
        (m) => m.BpmApplicationModule
      ),
    canActivate: [BpmAuthGuard],
  },
  {
    path: 'applicationList',
    loadChildren: () =>
      import('../bpm-application-list/bpm-application-list.module').then(
        (m) => m.BpmApplicationListModule
      ),
    canActivate: [BpmAuthGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
    }),
  ],
  exports: [RouterModule],
})
export class BpmRoutingModule {}
