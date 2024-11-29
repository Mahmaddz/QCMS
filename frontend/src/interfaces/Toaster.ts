type ToastType = 'success' | 'error' | 'info' | 'warn' | 'default';

export interface Toast {
    (text?: string, type?: ToastType) : void
}