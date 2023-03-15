import {
  Injectable,
  ComponentFactoryResolver,
  Injector,
  ViewContainerRef,
  Type,
} from '@angular/core';

import { BpmApplicationFinalDocumentsComponent } from '../lazy/components/bpm-application-final-documents/bpm-application-final-documents.component';
import { LazyAgreementComponent } from '../lazy/components/agreement/agreement.component';

@Injectable({ providedIn: 'root' })
export class BpmLazyLoaderService {
  constructor(
    protected cfr: ComponentFactoryResolver,
    protected injector: Injector
  ) {}

  loadApplicationFinalDocuments = async (
    container: ViewContainerRef,
    injector?: Injector
  ): Promise<BpmApplicationFinalDocumentsComponent> => {
    const { BpmApplicationFinalDocumentsComponent } = await import(
      '../lazy/components/bpm-application-final-documents/bpm-application-final-documents.component'
    );

    return this._resolve(
      BpmApplicationFinalDocumentsComponent,
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

  protected _resolve = <T>(
    component: Type<T>,
    container: ViewContainerRef,
    injector: Injector
  ): T => {
    const factory = this.cfr.resolveComponentFactory(component);
    const { instance } = container.createComponent(factory, null, injector);
    return instance;
  };
}
