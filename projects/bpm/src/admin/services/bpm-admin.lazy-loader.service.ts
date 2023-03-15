import { BpmLazyLoaderService } from '../../app/services/lazy-loader.service';
import { Injectable, ViewContainerRef, Injector } from '@angular/core';
import { LazyBpmAdminRegisterComponent } from '../../lazy/components/bpm-admin-register/bpm-admin-register.component';

@Injectable()
export class BpmAdminLazyLoaderService extends BpmLazyLoaderService {
  loadAdminRegisterComponent = async (
    container: ViewContainerRef,
    injector?: Injector
  ): Promise<LazyBpmAdminRegisterComponent> => {
    const { LazyBpmAdminRegisterComponent } = await import(
      '../../lazy/components/bpm-admin-register/bpm-admin-register.component'
    );
    return this._resolve(
      LazyBpmAdminRegisterComponent,
      container,
      injector || this.injector
    );
  };
}
