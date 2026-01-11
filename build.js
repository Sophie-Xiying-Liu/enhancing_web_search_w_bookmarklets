/**
 * Build script for creating minified bookmarklets
 *
 * This script bundles the bookmarklet code with its dependencies,
 * minifies it, and formats it as a javascript: protocol URL.
 */

import { build } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const BOOKMARKLETS_DIR = join(__dirname, 'bookmarklets');
const DIST_DIR = join(__dirname, 'dist');
const SRC_DIR = join(__dirname, 'src');

// Ensure dist directory exists
mkdirSync(DIST_DIR, { recursive: true });

/**
 * Builds a bookmarklet from source file
 * @param {string} bookmarkletFile - Path to bookmarklet source file
 * @param {string} outputName - Name for output file (without extension)
 */
async function buildBookmarklet(bookmarkletFile, outputName) {
  console.log(`Building ${outputName}...`);

  try {
    // Bundle and minify using esbuild
    const result = await build({
      entryPoints: [bookmarkletFile],
      bundle: true,
      minify: true,
      format: 'iife',
      target: ['es2015'],
      outfile: join(DIST_DIR, `${outputName}.min.js`),
      write: false, // We'll write manually
      banner: {
        js: '// Bookmarklet: Drag this to your bookmark bar\n',
      },
    });

    // Get the bundled code
    const bundledCode = result.outputFiles[0].text;

    // Wrap in IIFE and create javascript: protocol URL
    // Remove the banner comment for the final bookmarklet
    const cleanCode = bundledCode.replace(/^\/\/.*\n/, '');
    const wrappedCode = `(function(){${cleanCode}})();`;
    const bookmarkletUrl = `javascript:${encodeURIComponent(wrappedCode)}`;

    // Write minified JS file
    writeFileSync(join(DIST_DIR, `${outputName}.min.js`), cleanCode);

    // Write bookmarklet URL file (for easy copying)
    writeFileSync(
      join(DIST_DIR, `${outputName}.bookmarklet.txt`),
      bookmarkletUrl
    );

    // Write HTML file with install instructions
    const htmlContent = generateInstallHTML(
      outputName,
      bookmarkletUrl,
      cleanCode
    );
    writeFileSync(join(DIST_DIR, `${outputName}.html`), htmlContent);

    console.log(`✓ Built ${outputName}`);
    console.log(`  - Minified JS: dist/${outputName}.min.js`);
    console.log(`  - Bookmarklet URL: dist/${outputName}.bookmarklet.txt`);
    console.log(`  - Install page: dist/${outputName}.html`);
  } catch (error) {
    console.error(`✗ Error building ${outputName}:`, error.message);
    process.exit(1);
  }
}

/**
 * Generates HTML file with installation instructions
 * @param {string} name - Bookmarklet name
 * @param {string} bookmarkletUrl - The javascript: URL
 * @param {string} code - The minified code
 * @returns {string} HTML content
 */
function generateInstallHTML(name, bookmarkletUrl, code) {
  const displayName = name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Install ${displayName} Bookmarklet</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      line-height: 1.6;
      color: #202124;
    }
    h1 {
      color: #1a73e8;
      margin-bottom: 10px;
    }
    .bookmarklet-link {
      display: inline-block;
      padding: 12px 24px;
      background: #1a73e8;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 500;
      margin: 20px 0;
      transition: background 0.2s;
    }
    .bookmarklet-link:hover {
      background: #1765cc;
    }
    .instructions {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .instructions ol {
      margin: 10px 0;
      padding-left: 20px;
    }
    .instructions li {
      margin: 8px 0;
    }
    .code-block {
      background: #f1f3f4;
      padding: 15px;
      border-radius: 4px;
      overflow-x: auto;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      margin: 10px 0;
    }
    .warning {
      background: #fef7e0;
      border-left: 4px solid #fbbc04;
      padding: 12px 16px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <h1>${displayName} Bookmarklet</h1>
  <p>Redirect Google searches to alternative search engines with parameter preservation.</p>
  
  <div class="instructions">
    <h2>Installation Instructions</h2>
    <ol>
      <li>Drag the link below to your browser's bookmark bar:</li>
    </ol>
    <a href="${bookmarkletUrl}" class="bookmarklet-link" onclick="return false;">
      ${displayName}
    </a>
    <ol start="2">
      <li>Or right-click the link above and select "Bookmark Link"</li>
      <li>Go to a Google search results page</li>
      <li>Click the bookmarklet in your bookmark bar</li>
      <li>Select which parameters to preserve and click "Redirect"</li>
    </ol>
  </div>

  <div class="warning">
    <strong>Note:</strong> This bookmarklet only works on Google search results pages.
  </div>

  <details>
    <summary style="cursor: pointer; font-weight: 500; margin: 20px 0;">View Bookmarklet Code</summary>
    <div class="code-block">
      <pre>${code.substring(0, 500)}${code.length > 500 ? '...' : ''}</pre>
    </div>
    <p><small>Code length: ${code.length} characters</small></p>
  </details>
</body>
</html>`;
}

/**
 * Main build function
 */
async function main() {
  console.log('Starting bookmarklet build...\n');

  // Build DuckDuckGo bookmarklet
  await buildBookmarklet(join(BOOKMARKLETS_DIR, 'duckduckgo.js'), 'duckduckgo');

  console.log('\n✓ Build complete!');
  console.log('\nGenerated files in dist/ directory:');
  console.log('  - .min.js files: Minified JavaScript');
  console.log('  - .bookmarklet.txt files: javascript: URLs for copying');
  console.log('  - .html files: Installation pages');
}

// Run build
main().catch(error => {
  console.error('Build failed:', error);
  process.exit(1);
});
