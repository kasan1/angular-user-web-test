import {
  Injectable,
  ComponentFactoryResolver,
  Injector,
  ViewContainerRef,
  Type,
} from '@angular/core';
import { LazyOkapsRegisterComponent } from '../lazy/components/okaps-register/okaps-register.component';
import { LazyAgreementComponent } from '../lazy/components/agreement/agreement.component';
import { LazyApplicationStatusComponent } from '../lazy/components/applicationStatus/applicationStatus.component';
import { LazyApplicationCheckStatusComponent } from '../lazy/components/application-check-status/application-check-status.component';
import { LazyApplicationCompleeteComponent } from '../lazy/components/application-compleete/application-compleete.component';

@Injectable({ providedIn: 'root' })
export class OkapsLazyLoaderService {
  constructor(
    private cfr: ComponentFactoryResolver,
    private injector: Injector
  ) {}

  loadOkapsRegisterComponent = async (
    container: ViewContainerRef,
    injector?: Injector
  ): Promise<LazyOkapsRegisterComponent> => {
    const { LazyOkapsRegisterComponent } = await import(
      '../lazy/components/okaps-register/okaps-register.component'
    );
    return this._resolve(
      LazyOkapsRegisterComponent,
      container,
      injector || this.injector
    );
  };

  loadAgreementComponent = async (
    container: ViewContainerRef,
    injector?: Injector
  ): Promise<LazyAgreementComponent> => {
    const { LazyAgreementComponent } = await import(
      '../lazy/components/agreement/agreement.component'
    );

    return this._resolve(
      LazyAgreementComponent,
      container,
      injector || this.injector
    );
  };

  loadApplicationStatusComponent = async (
    container: ViewContainerRef,
    injector?: Injector
  ): Promise<LazyApplicationStatusComponent> => {
    const { LazyApplicationStatusComponent } = await import(
      '../lazy/components/applicationStatus/applicationStatus.component'
    );

    return this._resolve(
      LazyApplicationStatusComponent,
      container,
      injector || this.injector
    );
  };

  loadApplicationCheckStatusComponent = async (
    container: ViewContainerRef,
    injector?: Injector
  ): Promise<LazyApplicationCheckStatusComponent> => {
    const { LazyApplicationCheckStatusComponent } = await import(
      '../lazy/components/application-check-status/application-check-status.component'
    );

    return this._resolve(
      LazyApplicationCheckStatusComponent,
      container,
      injector || this.injector
    );
  };  

  loadApplicationCompleeteComponent = async (
    container: ViewContainerRef,
    injector?: Injector
  ): Promise<LazyApplicationCompleeteComponent> => {
    const { LazyApplicationCompleeteComponent } = await import(
      '../lazy/components/application-compleete/application-compleete.component'
    );

    return this._resolve(
      LazyApplicationCompleeteComponent,
      container,
      injector || this.injector
    );
  };  

  private _resolve = <T>(
    component: Type<T>,
    container: ViewContainerRef,
    injector: Injector
  ): T => {
    const factory = this.cfr.resolveComponentFactory(component);
    const { instance } = container.createComponent(factory, null, injector);
    return instance;
  };
}
