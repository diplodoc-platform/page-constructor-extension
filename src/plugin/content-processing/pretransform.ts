import type MarkdownIt from 'markdown-it';
import { preprocess, PreloadParams, TransformerRaw } from './preprocess';

/**
 * Pre-transforms YFM blocks inside page-constructor content
 * 
 * @param content - The page constructor content with blocks
 * @param env - The markdown-it environment
 * @param md - The markdown-it instance
 * @returns The content with transformed YFM blocks
 */
export function preTransformYfmBlocks(content: { blocks: any }, env: any, md: MarkdownIt) {
    
    if (!content.blocks) {
        return content;
    }

    // Extract YFM strings from the content
    const strings = new Set<string>();
    const extract = (_lang: string, string: string) => {
        strings.add(string);
        return string;
    };

    // Use preprocess to extract YFM strings
    const options: PreloadParams = { lang: env.lang || 'en' };
    preprocess(content, options, extract);

    const keys = [...strings];
    if (!keys.length) {
        return content;
    }

    // Transform the extracted YFM strings
    const values: Record<string, string> = {};
    
    // Transform each YFM string using markdown-it
    keys.forEach(string => {
        try {
            // Create a temporary environment for rendering
            const tempEnv = { ...env };
            
            // Render the YFM content using markdown-it
            const transformed = md.render(string, tempEnv);
            
            // Store the transformed content
            values[string] = transformed;
            
            // If the transformation generated any dependencies or assets, merge them with the main env
            if (tempEnv.deps) {
                env.deps = env.deps || [];
                env.deps.push(...tempEnv.deps);
            }
            
            if (tempEnv.assets) {
                env.assets = env.assets || new Set();
                tempEnv.assets.forEach((asset: string) => env.assets.add(asset));
            }
            
            // Merge any metadata
            if (tempEnv.meta) {
                env.meta = env.meta || {};
                Object.assign(env.meta, tempEnv.meta);
            }
        } catch (error) {
            console.error('Error transforming YFM content:', error);
            // Fall back to the original string if transformation fails
            values[string] = string;
        }
    });

    // Apply the transformed content back to the page-constructor blocks
    const compose: TransformerRaw = (_lang: string, string: string) => values[string] || string;
    
    return preprocess(content, options, compose);
}