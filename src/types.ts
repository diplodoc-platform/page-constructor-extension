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
    assetLinkResolver?: (link: string) => string;
    contentLinkResolver?: (link: string, currentPath?: string) => string;
    onBundle?: (env: {bundled: Set<string>}, output: string, runtime: Runtime) => void;
    projectSettings?: ProjectSettings;
};

export type PageConstructorControllerType = {
    render: () => void;
};
