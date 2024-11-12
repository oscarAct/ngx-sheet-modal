export interface SheetConfig {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    sheetSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    placement?: 'bottom' | 'top' | 'center';
    maxSheetHeight?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    backdropClose?: boolean;
    lockBodyScroll?: boolean;
    closeButtonIcon?: string;
    backdropIntensity?: number;
    resizable?: boolean;
    dragIndicator?: boolean;
    closeButton?: boolean;
    backgroundScale?: {
        enabled: boolean;
        rootBackgroundColor: string;
        bodyBackgroundColor: string;
    };
    styles?: {
        backdropClasses?: string;
        sheetClasses?: string;
        allowAnimations?: boolean;
        closeButtonClasses?: string;
    };
    closeOnflickDown?: {
        enabled?: boolean;
        flickThreshold: number;
    }
}