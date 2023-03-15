import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OkapsUnauthorizedComponent } from './components/okaps-unauthorized/okaps-unauthorized.component';
import { OkapsAuthGuard } from './services/auth.guard.service';
import { OkapsLizingComponent } from './components/okaps-lizing/okaps-lizing.component';
import { OkapsProductsComponent } from './components/okaps-products/okaps-products.component';
import { OkapsApplicationComponent } from './components/okaps-application/okaps-application.component';
import { OkapsLoginComponent } from './components/okaps-login/okaps-login.component';

export const routes: Routes = [
  { path: '', component: OkapsLizingComponent },
  { path: 'application', component: OkapsApplicationComponent },
  { path: 'unauthorized', component: OkapsUnauthorizedComponent },
  { path: 'login', component: OkapsLoginComponent },
  {
    path: 'products',
    component: OkapsProductsComponent,
    canActivate: [OkapsAuthGuard],
  },
  {
    path: 'products/:id',
    component: OkapsApplicationComponent,
    canActivate: [OkapsAuthGuard],
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
export class OkapsRoutingModule {}
