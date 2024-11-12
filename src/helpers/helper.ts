import { SheetConfig } from "../lib/ngx-sheet-modal-config";
import { APP_ROOT_SELECTOR, BODY_BACKGROUND_COLOR, MOBILE_BREAKPOINT, ROOT_ANIMATION_DURATION, ROOT_ANIMATION_TIMING_FUNCTION, ROOT_BACKGROUND_COLOR, ROOT_BORDER_RADIUS, ROOT_DISPLAY, ROOT_HEIGHT, ROOT_OVERFLOW, ROOT_TRANSFORM_Y_VALUE, ROOT_TRANSITION, ROOT_WIDTH, WINDOW_TOP_OFFSET } from "./constants";

export function getScaleValue(): number {
    return (window.innerWidth - WINDOW_TOP_OFFSET) / window.innerWidth || 0.94;
}
export function scaleBackground(config: SheetConfig) {
    const root = document.querySelector(APP_ROOT_SELECTOR) as HTMLElement;
    document.body.style.background = config.backgroundScale?.bodyBackgroundColor || BODY_BACKGROUND_COLOR;;
    if(root) {
      root.style.transition = ROOT_TRANSITION;
      root.style.display = ROOT_DISPLAY;
      root.style.overflow = ROOT_OVERFLOW;
      root.style.height = ROOT_HEIGHT;
      root.style.width = ROOT_WIDTH;
      root.style.transform = `scale(${getScaleValue()}, ${ROOT_TRANSFORM_Y_VALUE})`;
      root.style.background = config.backgroundScale?.rootBackgroundColor || ROOT_BACKGROUND_COLOR;
      root.style.borderRadius = ROOT_BORDER_RADIUS;
      root.style.animationDuration = ROOT_ANIMATION_DURATION;
      root.style.animationTimingFunction = ROOT_ANIMATION_TIMING_FUNCTION;
    }
  }

 export function unScaleBackground() {
    const root = document.querySelector(APP_ROOT_SELECTOR) as HTMLElement;
    if(root) {
      root.style.transform = 'scale(1, 1)';
      root.style.borderRadius = '0 0 0 0';
      root.style.background = ROOT_BACKGROUND_COLOR;
      root.style.overflow = 'auto';
      setTimeout(() => {
        root.style.display = '';
        root.style.height = '';
        root.style.width = '';
        document.body.style.background = '';
      }, 300);
    }
  }

  export function existAnInstance() {
    if (document.body.querySelectorAll('ngx-sheet-modal').length > 1) {
      return true;
    } 
    else {
      return false;
    }
  }

  export function isMobileDevice(): boolean {
    // @ts-ignore
    const userAgent = navigator.userAgent || navigator.vendor || window?.opera;

    // Detects iOS, Android, or Windows Phone
    const isMobile = /android|iphone|ipad|ipod|iemobile|windows phone|opera mini/i.test(userAgent);

    // Also verifies the screen width to enhance the presition
    const isSmallScreen = window.innerWidth <= MOBILE_BREAKPOINT;

    return isMobile || isSmallScreen;
  }