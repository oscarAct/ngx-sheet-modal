import { BACKDROP_INTENSITY_REDUCER, MODAL_CONTENT_OFFSET, OVERSHOOT_RESISTENCE_MULTIPLIER, VELOCITY_THRESHOLD } from './../helpers/constants';
import { AfterViewInit, Component, ComponentFactoryResolver, ElementRef, EventEmitter, Input, OnDestroy, Output, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { SheetConfig } from './ngx-sheet-modal-config';
import { existAnInstance, isMobileDevice, scaleBackground, unScaleBackground } from '../helpers/helper';
import { NgIf } from '@angular/common';

enum Sizes {
  xs = 75,
  sm = 60,
  md = 40,
  lg = 20,
  xl = 5
}

@Component({
  selector: 'ngx-sheet-modal',
  standalone: true,
  imports: [NgIf],
  templateUrl: './ngx-sheet-modal.component.html',
  styleUrl: './ngx-sheet-modal.component.css'
})
export class NgxSheetModalComponent implements AfterViewInit, OnDestroy {

  @ViewChild('contentHost', { read: ViewContainerRef }) public contentHost!: ViewContainerRef;
  @ViewChild('backdrop') private backdrop!: ElementRef;
  @ViewChild('sheet') private sheet!: ElementRef;
  @ViewChild('sheetContent') private sheetContent!: ElementRef;
  @Input() component!: Type<any>;
  @Output() childInstanceReady = new EventEmitter<any>();

  public componentInstance!: any;

  private defaultConfig: SheetConfig = {
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
      flickThreshold: VELOCITY_THRESHOLD
    }
  }
  protected _config!: SheetConfig;
  public initialY = 0;
  private currentY = 0;
  private isDragging = false;
  private startingTranslateY = 0;
  public initialTime: number = 0;
  private backdropIntensity: number = 0.8;

  // @ts-ignore
  private upperLimit!: number;

  @Input() set config(value: SheetConfig | null) {
    this._config = { ...this.defaultConfig, ...value };
    // @ts-ignore
    this.backdropIntensity = this._config.backdropIntensity;
    // @ts-ignore
    this.upperLimit = Sizes[this._config.maxSheetHeight]
  }

  constructor(private elementRef: ElementRef, private componentFactoryResolver: ComponentFactoryResolver) { }

  ngAfterViewInit() {
    if (this.component) this.loadContent(this.component);
    this.loadSheet();
    this.sheet.nativeElement.addEventListener('mousedown', this.startDrag.bind(this));
    this.sheet.nativeElement.addEventListener('touchstart', this.startDrag.bind(this), { passive: true });
  }

  ngOnDestroy() {
    this.removeEventListeners();
  }

  close() {
    if (isMobileDevice()) {
      this.backdrop.nativeElement.style.opacity = '0';
      this.sheet.nativeElement.style.transform = 'translate3d(0, 110%, 0)'
      setTimeout(() => {
        if (!existAnInstance()) {
          if (this._config?.lockBodyScroll) document.body.style.overflow = 'auto';
          unScaleBackground();
        }
        try {
          document.body.removeChild(this.elementRef.nativeElement);
        } catch (error: any) {
          console.warn(error.message)
        }
      }, 400);
    } else {
      this.backdrop.nativeElement.style.opacity = '0';
      this.sheet.nativeElement.classList.remove('show');
      setTimeout(() => {
        if (!existAnInstance()) {
          if (this._config?.lockBodyScroll) document.body.style.overflow = 'auto';
        }
        try {
          document.body.removeChild(this.elementRef.nativeElement);
        } catch (error: any) {
          console.warn(error.message)
        }
      }, 200);
    }
  }

  private loadContent(component: any) {
    const factory = this.componentFactoryResolver.resolveComponentFactory(component);
    this.contentHost.clear();
    this.componentInstance = this.contentHost.createComponent(factory);
    this.childInstanceReady.emit(this.componentInstance.instance)
  }

  private loadSheet() {
    if (isMobileDevice()) {
      setTimeout(() => {
        if (!existAnInstance()) {
          if (this._config?.lockBodyScroll) document.body.style.overflow = 'hidden';
          if (this._config.backgroundScale?.enabled) scaleBackground(this._config);
        }
        this.adjustBackdrop(true);
        // @ts-ignore
        this.sheet.nativeElement.style.transform = `translate3d(0, ${Sizes[this._config.sheetSize]}%, 0)`;
        // @ts-ignore
        this.startingTranslateY = Sizes[this._config.sheetSize];
        // @ts-ignore
        this.currentY = Sizes[this._config.sheetSize];
        this.calculateContentHeight();
      }, 10);
    } else {
      setTimeout(() => {
        if (!existAnInstance()) {
          if (this._config?.lockBodyScroll) document.body.style.overflow = 'hidden';
        }
        // @ts-ignore
        this.backdrop.nativeElement.style.opacity = this._config.backdropIntensity - (this._config.backdropIntensity * BACKDROP_INTENSITY_REDUCER);
        this.sheet.nativeElement.classList.add('show');
        this.sheet.nativeElement.classList.add(this._config.placement);
      }, 10);
    }
  }

  public startDrag(event: MouseEvent | TouchEvent) {

    if (!this._config?.resizable || !isMobileDevice()) return;

    this.sheet.nativeElement.classList.remove('sm-sheet-transition');
    this.backdrop.nativeElement.style.transitionDuration = '0ms';
    this.isDragging = true;
    this.initialY = this.getEventY(event);
    this.initialTime = Date.now();

    window.addEventListener('mousemove', this.drag.bind(this));
    window.addEventListener('mouseup', this.endDrag.bind(this));
    window.addEventListener('touchmove', this.drag.bind(this), { passive: false });
    window.addEventListener('touchend', this.endDrag.bind(this));
  }

  private drag(event: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;

    const currentY = this.getEventY(event);
    const deltaY = currentY - this.initialY;

    const sheetContent = this.sheetContent.nativeElement;
    const isAtTop = sheetContent.scrollTop === 0;
    const isAtBottom = sheetContent.scrollTop === (sheetContent.scrollHeight - sheetContent.clientHeight);

    // @ts-ignore
    if (!event?.target?.classList?.contains('sm-sheet-drag-container')) {
      if (isAtTop && deltaY > 0) {
        event.preventDefault();
      } else if (isAtBottom && deltaY < 0) {
        event.preventDefault();
      } else {
        this.isDragging = false;
        this.removeEventListeners();
        return;
      }
    }

    this.currentY = this.startingTranslateY + (deltaY / window.innerHeight) * 100;

    if (this.currentY < this.upperLimit) {
      const overshoot = this.upperLimit - this.currentY;
      this.currentY = this.upperLimit - overshoot * OVERSHOOT_RESISTENCE_MULTIPLIER;
    }

    this.sheet.nativeElement.style.transform = `translate3d(0, ${this.currentY}%, 0)`;
    this.calculateContentHeight();
    this.adjustBackdrop();
  }

  public endDrag(event: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;

    this.isDragging = false;
    this.sheet.nativeElement.classList.add('sm-sheet-transition');
    this.backdrop.nativeElement.style.transitionDuration = '600ms';
    this.removeEventListeners();

    const endTime = Date.now();
    const timeElapsed = endTime - this.initialTime;
    const currentY = this.getEventY(event);
    const distanceY = currentY - this.initialY;

    // Calculate the velocity
    const velocity = distanceY / timeElapsed;

    // Flick detection
    // @ts-ignore
    if (velocity > this._config.closeOnflickDown?.flickThreshold && this._config.closeOnflickDown?.enabled) {
      this.close();
      return;
    }

    // Overshoot prevent
    if (this.currentY < this.upperLimit) {
      this.currentY = this.upperLimit;
      this.sheet.nativeElement.style.transform = `translate3d(0, ${this.currentY}%, 0)`;
      this._config.sheetSize = this._config.maxSheetHeight;
      this.startingTranslateY = this.upperLimit;
      return;
    }
    this.snapToNearestPoint();
    this.calculateContentHeight();
    this.adjustBackdrop();
  }

  private snapToNearestPoint() {
    const snapPoints = [Sizes['xl'], Sizes['lg'], Sizes['md'], Sizes['sm'], Sizes['xs']];
    let closestSnapPoint = snapPoints[0];

    for (let i = 1; i < snapPoints.length; i++) {
      if (Math.abs(this.currentY - snapPoints[i]) < Math.abs(this.currentY - closestSnapPoint)) {
        closestSnapPoint = snapPoints[i];
      }
    }

    // Applies the snap to the nearest point
    this.currentY = closestSnapPoint;
    this.sheet.nativeElement.style.transform = `translate3d(0, ${this.currentY}%, 0)`;

    const sizeKey = Object.keys(Sizes).find(key => Sizes[key as keyof typeof Sizes] === closestSnapPoint);
    if (sizeKey) {
      this._config.sheetSize = sizeKey as keyof typeof Sizes;
      this.startingTranslateY = closestSnapPoint;
    }
  }

  private calculateContentHeight() {
    const translatePercentage = this.currentY / 100;
    const backdropHeight = this.backdrop.nativeElement.clientHeight;
    const sheetSize = backdropHeight - (backdropHeight * translatePercentage);
    const offset = MODAL_CONTENT_OFFSET;

    this.sheetContent.nativeElement.style.height = `${sheetSize - offset}px`;

  }

  private getEventY(event: MouseEvent | TouchEvent): number {
    if (event instanceof MouseEvent) {
      return event.clientY;
    } else if (event instanceof TouchEvent) {
      return event.touches[0]?.clientY ?? event.changedTouches[0].clientY;
    }
    return 0;
  }

  private adjustBackdrop(loadSheet: boolean = false) {
    if (loadSheet) {
      if (this._config.backdropIntensity) {
        this.backdropIntensity = this._config.backdropIntensity - Math.abs((Sizes[this._config.sheetSize || 'md'] * this._config.backdropIntensity) / 100);
        this.backdrop.nativeElement.style.opacity = this.backdropIntensity;
      }
    } else {
      if (this._config.backdropIntensity) {
        this.backdropIntensity = this._config.backdropIntensity - Math.abs((this.currentY * this._config.backdropIntensity) / 100);
        this.backdrop.nativeElement.style.opacity = this.backdropIntensity;
      }
    }
  }
  // Removes the event listeners of the window object
  private removeEventListeners() {
    window.removeEventListener('mousemove', this.drag.bind(this));
    window.removeEventListener('mouseup', this.endDrag.bind(this));
    window.removeEventListener('touchmove', this.drag.bind(this));
    window.removeEventListener('touchend', this.endDrag.bind(this));
  }
}
