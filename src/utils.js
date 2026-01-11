/**
 * Utility functions for extracting and processing Google search parameters
 */

/**
 * Checks if the current page is a Google search results page
 * @returns {boolean} True if on Google search page
 */
export function isGoogleSearchPage() {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  return (
    (hostname === 'www.google.com' || hostname === 'google.com') &&
    pathname === '/search'
  );
}

/**
 * Extracts all parameters from the current page's URL
 * @returns {Object} Object with parameter names as keys and values as values
 */
export function extractUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const params = {};

  for (const [key, value] of urlParams.entries()) {
    params[key] = value;
  }

  return params;
}

/**
 * Extracts the search query from Google URL parameters
 * @returns {string|null} The search query or null if not found
 */
export function extractSearchQuery() {
  const params = extractUrlParams();
  return params.q || null;
}

/**
 * Gets a human-readable description of a Google search parameter
 * @param {string} paramName - The parameter name (e.g., 'tbs', 'lr')
 * @param {string} paramValue - The parameter value
 * @returns {string} Human-readable description
 */
export function getParameterDescription(paramName, paramValue) {
  const descriptions = {
    q: 'Search Query',
    tbs: parseTimeBasedSearch(paramValue),
    lr: 'Language Restriction',
    cr: 'Country Restriction',
    num: `Number of Results: ${paramValue}`,
    safe: parseSafeSearch(paramValue),
    tbm: parseSearchType(paramValue),
    tbs_qdr: parseTimeRange(paramValue),
    source: 'Source',
    hl: `Language: ${paramValue}`,
    gl: `Country: ${paramValue}`,
  };

  return descriptions[paramName] || `${paramName}: ${paramValue}`;
}

/**
 * Parses Google's time-based search parameter (tbs)
 * @param {string} tbsValue - The tbs parameter value
 * @returns {string} Human-readable description
 */
function parseTimeBasedSearch(tbsValue) {
  if (!tbsValue) return 'Time Filter';

  // Common time filters
  if (tbsValue.includes('qdr:d')) return 'Time Filter: Past Day';
  if (tbsValue.includes('qdr:w')) return 'Time Filter: Past Week';
  if (tbsValue.includes('qdr:m')) return 'Time Filter: Past Month';
  if (tbsValue.includes('qdr:y')) return 'Time Filter: Past Year';
  if (tbsValue.includes('cdr:1')) return 'Time Filter: Custom Date Range';

  return 'Time Filter';
}

/**
 * Parses Google's safe search parameter
 * @param {string} safeValue - The safe parameter value
 * @returns {string} Human-readable description
 */
function parseSafeSearch(safeValue) {
  const safeOptions = {
    active: 'Safe Search: Active',
    off: 'Safe Search: Off',
    images: 'Safe Search: Images',
  };
  return safeOptions[safeValue] || `Safe Search: ${safeValue}`;
}

/**
 * Parses Google's search type parameter (tbm)
 * @param {string} tbmValue - The tbm parameter value
 * @returns {string} Human-readable description
 */
function parseSearchType(tbmValue) {
  const searchTypes = {
    isch: 'Search Type: Images',
    vid: 'Search Type: Videos',
    nws: 'Search Type: News',
    shop: 'Search Type: Shopping',
    bks: 'Search Type: Books',
    fin: 'Search Type: Finance',
  };
  return searchTypes[tbmValue] || `Search Type: ${tbmValue}`;
}

/**
 * Parses time range parameter
 * @param {string} timeRange - The time range value
 * @returns {string} Human-readable description
 */
function parseTimeRange(timeRange) {
  const ranges = {
    d: 'Past Day',
    w: 'Past Week',
    m: 'Past Month',
    y: 'Past Year',
  };
  return `Time Range: ${ranges[timeRange] || timeRange}`;
}

/**
 * Builds a URL for a target search engine with selected parameters
 * @param {string} searchEngine - The target search engine ('duckduckgo', etc.)
 * @param {string} query - The search query
 * @param {Object} selectedParams - Object with parameter names as keys, true/false as values
 * @param {Object} allParams - All available parameters from Google
 * @returns {string} The complete URL for the target search engine
 */
export function buildSearchUrl(searchEngine, query, selectedParams, allParams) {
  const baseUrls = {
    duckduckgo: 'https://duckduckgo.com/',
  };

  const baseUrl = baseUrls[searchEngine];
  if (!baseUrl) {
    throw new Error(`Unsupported search engine: ${searchEngine}`);
  }

  // Always include the query
  const urlParams = new URLSearchParams();
  urlParams.set('q', query);

  // Map Google parameters to target search engine parameters
  // For DuckDuckGo, we'll preserve some common parameters
  if (searchEngine === 'duckduckgo') {
    // DuckDuckGo uses simpler parameters
    // Most Google-specific parameters don't have direct equivalents
    // But we can preserve some basic ones if needed
    // Note: DuckDuckGo doesn't support most Google parameters
    // So we mainly just pass the query
  }

  return `${baseUrl}?${urlParams.toString()}`;
}

/**
 * Gets all parameters except the search query
 * @param {Object} params - All URL parameters
 * @returns {Object} Parameters without the query
 */
export function getNonQueryParams(params) {
  const nonQueryParams = { ...params };
  delete nonQueryParams.q;
  return nonQueryParams;
}
