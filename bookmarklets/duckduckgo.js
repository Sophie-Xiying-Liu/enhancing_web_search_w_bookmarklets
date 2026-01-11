/**
 * DuckDuckGo Search Redirect Bookmarklet
 *
 * This bookmarklet redirects Google search queries to DuckDuckGo
 * with optional parameter preservation.
 *
 * Note: This is the development version. The build system will create
 * a minified, self-contained version for actual bookmarklet use.
 */

// Import utilities (will be bundled by build system)
import {
  isGoogleSearchPage,
  extractUrlParams,
  extractSearchQuery,
  buildSearchUrl,
  getNonQueryParams,
} from '../src/utils.js';

import { createModal } from '../src/ui.js';

/**
 * Main bookmarklet function
 * This will be wrapped in an IIFE and minified by the build system
 */
function duckduckgoRedirect() {
  // Check if we're on a Google search page
  if (!isGoogleSearchPage()) {
    alert(
      'This bookmarklet only works on Google search results pages.\n\nPlease navigate to a Google search results page and try again.'
    );
    return;
  }

  // Extract current search parameters
  const allParams = extractUrlParams();
  const searchQuery = extractSearchQuery();

  if (!searchQuery) {
    alert('No search query found in the current page.');
    return;
  }

  // Show modal for parameter selection
  createModal(
    allParams,
    searchQuery,
    // onSubmit callback
    selectedParams => {
      // Build DuckDuckGo URL with selected parameters
      const duckduckgoUrl = buildSearchUrl(
        'duckduckgo',
        searchQuery,
        selectedParams,
        allParams
      );

      // Open in new tab
      window.open(duckduckgoUrl, '_blank');
    },
    // onCancel callback
    () => {
      // User cancelled, do nothing
    }
  );
}

// Execute the bookmarklet
duckduckgoRedirect();

// Export for testing purposes
export { duckduckgoRedirect };
