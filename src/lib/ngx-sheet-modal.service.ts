import { ApplicationRef, ComponentFactoryResolver, EmbeddedViewRef, Injectable, Injector, Type } from '@angular/core';
import { NgxSheetModalComponent } from './ngx-sheet-modal.component';
import { SheetConfig } from './ngx-sheet-modal-config';

@Injectable({
  providedIn: 'root'
})
export class NgxSheetModalService {

  constructor(
    private injector: Injector,
    private applicationRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  openSheet(content: Type<any>, config?: SheetConfig) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(NgxSheetModalComponent);
    const componentRef = componentFactory.create(this.injector);

    // Adjust component on the Angular's tree view
    this.applicationRef.attachView(componentRef.hostView);

    // Insert component in the DOM
    document.body.appendChild((componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement);

    // Load the dynamic content
    componentRef.instance.component = content;
    if(config) componentRef.instance.config = config;

    

    return componentRef.instance;
  }
}
