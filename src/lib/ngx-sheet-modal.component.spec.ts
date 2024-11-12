import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NgxSheetModalComponent } from './ngx-sheet-modal.component';
import { Component, ElementRef } from '@angular/core';
import { SheetConfig } from './ngx-sheet-modal-config';

describe('NgxSheetModalComponent', () => {
  let component: NgxSheetModalComponent;
  let fixture: ComponentFixture<NgxSheetModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [NgxSheetModalComponent],
      providers: [{ provide: ElementRef, useValue: new ElementRef(document.createElement('div')) }]
    }).compileComponents();

    fixture = TestBed.createComponent(NgxSheetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set default config if no config is provided', () => {
    const defaultConfig: SheetConfig = {
      size: 'sm',
      sheetSize: 'lg',
      placement: 'center',
      maxSheetHeight: 'xl',
      backdropClose: true,
      backdropIntensity: 0.7,
      resizable: true,
      dragIndicator: true,
      backgroundScale: {
        enabled: false,
        rootBackgroundColor: 'white',
        bodyBackgroundColor: 'black'
      },
      closeButton: true,
      lockBodyScroll: true,
      styles: {
        allowAnimations: true,
        backdropClasses: '',
        sheetClasses: '',
        closeButtonClasses: ''
      },
      closeOnflickDown: {
        enabled: true,
        flickThreshold: 0.5
      }
    };
    component.config = null;
    expect(component['_config']).toEqual(defaultConfig);
  });

  it('should emit childInstanceReady event after loading content', () => {
    spyOn(component.childInstanceReady, 'emit');
    component.component = TestComponent;
    component.ngAfterViewInit();
    expect(component.childInstanceReady.emit).toHaveBeenCalled();
  });
  
});

@Component({
  selector: 'test-component',
  template: '<div>Test Component</div>'
})
class TestComponent { }