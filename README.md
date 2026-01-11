This is a project built by using Cursor.

It's a course project from [Build with AI: Mindset, Habits & Tools for the Next 20 Years](https://www.superlinear.academy/c/ai/sections/334458/lessons/1240532).

# Enhancing Web Search with Bookmarklets

Bookmarklets to redirect Google search queries to alternative search engines (like DuckDuckGo) with optional parameter preservation.

## Features

- 🔍 Redirect Google searches to alternative search engines
- ⚙️ Select which search parameters to preserve
- 🎨 Clean, user-friendly interface
- 🚀 Easy installation - just drag to bookmark bar
- 🔒 Privacy-focused alternative to Google

## Installation

### Quick Install

1. Build the bookmarklets:

   ```bash
   npm install
   npm run build
   ```

2. Open the installation page:
   - Open `dist/duckduckgo.html` in your browser
   - Drag the bookmarklet link to your bookmark bar

### Manual Install

1. Build the bookmarklets:

   ```bash
   npm install
   npm run build
   ```

2. Copy the bookmarklet URL:
   - Open `dist/duckduckgo.bookmarklet.txt`
   - Copy the entire `javascript:` URL

3. Create a bookmark:
   - Right-click your bookmark bar
   - Select "Add page" or "New bookmark"
   - Paste the URL as the bookmark address
   - Name it "DuckDuckGo Search" (or your preferred name)

## Usage

1. Perform a search on Google
2. If you're not satisfied with the results, click the bookmarklet in your bookmark bar
3. A modal will appear showing:
   - Your current search query
   - Available search parameters (time filters, language, etc.)
4. Select which parameters you want to preserve (or choose "Search query only")
5. Click "Redirect" to open the search in DuckDuckGo in a new tab

## Supported Search Engines

Currently supported:

- **DuckDuckGo** - Privacy-focused search engine

More search engines coming soon!

## Development

### Project Structure

```
enhanceing_web_search_w_bookmarklets/
├── bookmarklets/          # Bookmarklet source files
│   └── duckduckgo.js
├── src/                   # Shared source code
│   ├── utils.js          # Parameter extraction utilities
│   └── ui.js             # Modal UI component
├── test/                  # Test files
│   └── test-page.html    # Test page for development
├── dist/                  # Built bookmarklets (generated)
│   ├── duckduckgo.min.js
│   ├── duckduckgo.bookmarklet.txt
│   └── duckduckgo.html
├── build.js               # Build script
└── package.json
```

### Building

```bash
# Install dependencies
npm install

# Build bookmarklets
npm run build
```

The build process will:

- Bundle all dependencies
- Minify the code
- Create `javascript:` protocol URLs
- Generate installation pages

### Testing

1. Build the bookmarklets: `npm run build`
2. Open `test/test-page.html` in your browser
3. Install the bookmarklet from `dist/duckduckgo.html`
4. Use the test links on the test page to simulate different Google search scenarios
5. Click the bookmarklet to test functionality

### Adding a New Search Engine

1. Create a new file in `bookmarklets/` directory (e.g., `bing.js`)
2. Import utilities from `src/utils.js` and `src/ui.js`
3. Implement the redirect logic using `buildSearchUrl()`
4. Update `build.js` to include the new bookmarklet
5. Run `npm run build` to generate the minified version

Example:

```javascript
import {
  isGoogleSearchPage,
  extractUrlParams,
  buildSearchUrl,
} from '../src/utils.js';
import { createModal } from '../src/ui.js';

function bingRedirect() {
  // Implementation similar to duckduckgo.js
}
```

## Versioning

This project uses [Semantic Versioning](https://semver.org/) (vMAJOR.MINOR.PATCH):

- **Major version (v1.0.0 → v2.0.0)**: Breaking changes
  - Example: Changed how bookmarklets are installed, incompatible API changes
- **Minor version (v1.0.0 → v1.1.0)**: New features, backward compatible
  - Example: Added Bing search engine support, new parameter options
- **Patch version (v1.0.0 → v1.0.1)**: Bug fixes, backward compatible
  - Example: Fixed parameter extraction bug, UI improvements

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Author

Sophie-Xiying-Liu

## Repository

https://github.com/Sophie-Xiying-Liu/enhancing_web_search_w_bookmarklets
