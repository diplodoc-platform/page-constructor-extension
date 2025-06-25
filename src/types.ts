export type Runtime = {
    script: string;
    style: string;
};

export type ProjectSettings = {
    disableCompress?: boolean;
};

export type TransformOptions = {
    runtime?:
        | string
        | {
              script: string;
              style: string;
          };
    bundle?: boolean;
    assetLinkResolver?: (
        link: string,
        path?: string,
        root?: string,
        assetsPublicPath?: string,
    ) => string;
    contentLinkResolver?: (link: string, path?: string, root?: string) => string;
    onBundle?: (env: {bundled: Set<string>}, output: string, runtime: Runtime) => void;
    projectSettings?: ProjectSettings;
};

export type PreMountHook = (element: HTMLElement) => void | Promise<void>;

export type PageConstructorControllerType = {
    render: (theme?: string, preMountHook?: PreMountHook) => void;
};

export interface PageConstructorRuntimeProps {
    theme?: string;
    preMountHook?: PreMountHook;
}
