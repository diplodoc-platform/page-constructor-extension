const fs = require('fs');
const path = require('path');
const {visualizer} = require('esbuild-visualizer');

const generateVisualization = async (metaPath, outputPath) => {
    try {
        const metafile = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
        const html = await visualizer(metafile, {
            title: `Build Visualization - ${path.basename(metaPath)}`,
            template: 'treemap',
        });
        fs.writeFileSync(outputPath, html);
        console.log(`Visualization generated at ${outputPath}`);
    } catch (error) {
        console.error(`Error generating visualization for ${metaPath}:`, error);
    }
};

const processBuildMeta = async (result, config) => {
    if (result.metafile) {
        let metaPath;

        if (config.outfile) {
            const outDir = path.dirname(config.outfile);
            const baseName = path.basename(config.outfile, path.extname(config.outfile));
            metaPath = `${outDir}/${baseName}.meta.json`;
        } else if (config.outdir) {
            metaPath = `${config.outdir}/meta.json`;
        }

        if (metaPath) {
            fs.writeFileSync(metaPath, JSON.stringify(result.metafile, null, 2));
            console.log(`Build complete with metafile at ${metaPath}`);

            const visualizationPath = metaPath.replace('.json', '.html');
            await generateVisualization(metaPath, visualizationPath);
        }
    }
};

module.exports = {
    generateVisualization,
    processBuildMeta,
};
