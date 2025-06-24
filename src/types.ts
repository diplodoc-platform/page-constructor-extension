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
    assetLinkResolver?: (link: string, path?: string, root?: string) => string;
    contentLinkResolver?: (link: string, path?: string, root?: string) => string;
    onBundle?: (env: {bundled: Set<string>}, output: string, runtime: Runtime) => void;
    projectSettings?: ProjectSettings;
};

export type PageConstructorControllerType = {
    render: () => void;
};
