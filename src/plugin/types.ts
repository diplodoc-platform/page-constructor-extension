export type Runtime = {
    script: string;
    style: string;
};

export type PluginOptions = {
    runtime: string | Runtime;
    classes: string;
    bundle: boolean;
    assetLinkResolver?: (link: string) => string;
    contentLinkResolver?: (link: string) => string;
    onBundle?: (env: {bundled: Set<string>}, output: string, runtime: Runtime) => void;
};
