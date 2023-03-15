import { NgModule } from '@angular/core';

import { BpmRoutingModule } from './bpm-routing.module';
import { AppComponent } from './app.component';
import { BpmHomeComponent } from './components/bpm-home/bpm-home.component';
import { BpmNavigationComponent } from './components/bpm-navigation/bpm-navigation.component';
import { BpmLoginComponent } from './components/bpm-login/bpm-login.component';
import { BpmUnauthorizedComponent } from './components/bpm-unauthorized/bpm-unauthorized.component';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BpmJwtInterceptor } from './services/jwt.interceptor.service';
import { SharedModule } from 'projects/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { StoreModule } from '@ngrx/store';
import { bpmReducers } from './store/bpm';
import { BpmAuthEffects } from './store/effects/auth.effects';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { BpmErrorInterceptor } from './services/error.interceptor.service';
import { BpmDialogComponent } from './components/bpm-dialog/bpm-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    BpmHomeComponent,
    BpmNavigationComponent,
    BpmLoginComponent,
    BpmUnauthorizedComponent,
    BpmDialogComponent,
  ],
  imports: [
    SharedModule,
    HttpClientModule,
    BpmRoutingModule,
    BrowserAnimationsModule,
    StoreModule.forRoot(bpmReducers),
    EffectsModule.forRoot([BpmAuthEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
    }),
    MatSidenavModule,
    MatToolbarModule,
    MatButtonToggleModule,
  ],
  providers: [
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      },
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BpmJwtInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BpmErrorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class BpmModule {}
