export function renderError(message: string): string;
export function renderError(message: string, error: Error): string;
export function renderError(message: string, error: unknown): string;
export function renderError(message: string, error?: Error | unknown): string {
    let msg = message;
    if (error instanceof Error) {
        msg += error.message;
    } else if (error) {
        msg += String(error);
    }
    return `<div class="page-constructor-error">${msg}</div>`;
}
