export class ThemeStore {
    private listeners = new Set<() => void>();
    private clientTheme: string | undefined;
    private readonly ssrTheme: string | undefined;

    constructor(clientTheme: string | undefined, ssrTheme: string | undefined) {
        this.clientTheme = clientTheme;
        this.ssrTheme = ssrTheme;
    }

    subscribe = (listener: () => void): (() => void) => {
        this.listeners.add(listener);

        return () => {
            this.listeners.delete(listener);
        };
    };

    getSnapshot = (): string | undefined => this.clientTheme;

    getServerSnapshot = (): string | undefined => this.ssrTheme;

    setTheme(theme: string | undefined): void {
        if (this.clientTheme === theme) {
            return;
        }

        this.clientTheme = theme;
        this.listeners.forEach((listener) => listener());
    }
}
