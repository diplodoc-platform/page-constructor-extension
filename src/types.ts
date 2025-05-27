export type Runtime = {
    script: string;
    style: string;
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
};

export type PageConstructorControllerType = {
    render: () => void;
};
