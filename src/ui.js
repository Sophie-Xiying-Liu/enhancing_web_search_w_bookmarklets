/**
 * UI component for parameter selection modal
 */

import { getParameterDescription } from './utils.js';

/**
 * Creates and displays a modal overlay for selecting search parameters
 * @param {Object} params - All URL parameters from Google
 * @param {string} searchQuery - The search query
 * @param {Function} onSubmit - Callback function called when user submits
 * @param {Function} onCancel - Callback function called when user cancels
 * @returns {HTMLElement} The modal element
 */
export function createModal(params, searchQuery, onSubmit, onCancel) {
  // Remove existing modal if present
  const existingModal = document.getElementById('search-redirect-modal');
  if (existingModal) {
    existingModal.remove();
  }

  // Create modal overlay
  const modal = document.createElement('div');
  modal.id = 'search-redirect-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  `;

  // Create modal content box
  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background: white;
    border-radius: 8px;
    padding: 24px;
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  `;

  // Create header
  const header = document.createElement('h2');
  header.textContent = 'Redirect Search to Alternative Engine';
  header.style.cssText = `
    margin: 0 0 16px 0;
    font-size: 20px;
    font-weight: 600;
    color: #202124;
  `;

  // Create search query display
  const querySection = document.createElement('div');
  querySection.style.cssText = 'margin-bottom: 20px;';

  const queryLabel = document.createElement('label');
  queryLabel.textContent = 'Search Query:';
  queryLabel.style.cssText = `
    display: block;
    font-weight: 500;
    margin-bottom: 8px;
    color: #5f6368;
    font-size: 14px;
  `;

  const queryInput = document.createElement('input');
  queryInput.type = 'text';
  queryInput.value = searchQuery || '';
  queryInput.readOnly = true;
  queryInput.style.cssText = `
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #dadce0;
    border-radius: 4px;
    font-size: 14px;
    background-color: #f8f9fa;
    box-sizing: border-box;
  `;

  querySection.appendChild(queryLabel);
  querySection.appendChild(queryInput);

  // Create parameters section
  const paramsSection = document.createElement('div');
  paramsSection.style.cssText = 'margin-bottom: 20px;';

  const paramsLabel = document.createElement('label');
  paramsLabel.textContent = 'Select Parameters to Preserve:';
  paramsLabel.style.cssText = `
    display: block;
    font-weight: 500;
    margin-bottom: 12px;
    color: #5f6368;
    font-size: 14px;
  `;

  paramsSection.appendChild(paramsLabel);

  // Get non-query parameters
  const nonQueryParams = Object.keys(params).filter(key => key !== 'q');

  // Create "Query only" quick option
  const queryOnlyOption = createCheckboxOption(
    'query-only',
    'Search query only (no parameters)',
    true,
    false
  );
  queryOnlyOption.style.marginBottom = '12px';
  paramsSection.appendChild(queryOnlyOption);

  // Create separator
  const separator = document.createElement('div');
  separator.style.cssText = `
    height: 1px;
    background-color: #dadce0;
    margin: 12px 0;
  `;
  paramsSection.appendChild(separator);

  // Create checkboxes for each parameter
  const checkboxes = {};
  if (nonQueryParams.length === 0) {
    const noParamsMsg = document.createElement('p');
    noParamsMsg.textContent = 'No additional parameters found.';
    noParamsMsg.style.cssText = `
      color: #5f6368;
      font-size: 14px;
      margin: 8px 0;
      font-style: italic;
    `;
    paramsSection.appendChild(noParamsMsg);
  } else {
    nonQueryParams.forEach(paramName => {
      const description = getParameterDescription(paramName, params[paramName]);
      const checkbox = createCheckboxOption(
        paramName,
        description,
        false,
        false
      );
      checkboxes[paramName] = checkbox;
      paramsSection.appendChild(checkbox);
    });
  }

  // Handle "Query only" checkbox logic
  const queryOnlyCheckbox = queryOnlyOption.querySelector(
    'input[type="checkbox"]'
  );
  queryOnlyCheckbox.addEventListener('change', function () {
    if (this.checked) {
      // Uncheck all parameter checkboxes
      Object.values(checkboxes).forEach(cb => {
        cb.querySelector('input[type="checkbox"]').checked = false;
      });
    }
  });

  // Handle parameter checkbox changes
  Object.values(checkboxes).forEach(checkboxEl => {
    checkboxEl
      .querySelector('input[type="checkbox"]')
      .addEventListener('change', function () {
        if (this.checked) {
          // Uncheck "Query only"
          queryOnlyCheckbox.checked = false;
        }
      });
  });

  // Create button container
  const buttonContainer = document.createElement('div');
  buttonContainer.style.cssText = `
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 24px;
  `;

  // Create Cancel button
  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancel';
  cancelButton.style.cssText = `
    padding: 10px 24px;
    border: 1px solid #dadce0;
    border-radius: 4px;
    background: white;
    color: #5f6368;
    font-size: 14px;
    cursor: pointer;
    font-weight: 500;
  `;
  cancelButton.addEventListener('mouseenter', () => {
    cancelButton.style.backgroundColor = '#f8f9fa';
  });
  cancelButton.addEventListener('mouseleave', () => {
    cancelButton.style.backgroundColor = 'white';
  });
  cancelButton.addEventListener('click', () => {
    modal.remove();
    if (onCancel) onCancel();
  });

  // Create Redirect button
  const redirectButton = document.createElement('button');
  redirectButton.textContent = 'Redirect';
  redirectButton.style.cssText = `
    padding: 10px 24px;
    border: none;
    border-radius: 4px;
    background: #1a73e8;
    color: white;
    font-size: 14px;
    cursor: pointer;
    font-weight: 500;
  `;
  redirectButton.addEventListener('mouseenter', () => {
    redirectButton.style.backgroundColor = '#1765cc';
  });
  redirectButton.addEventListener('mouseleave', () => {
    redirectButton.style.backgroundColor = '#1a73e8';
  });
  redirectButton.addEventListener('click', () => {
    const selectedParams = {};

    if (queryOnlyCheckbox.checked) {
      // Only query, no parameters
      Object.keys(checkboxes).forEach(key => {
        selectedParams[key] = false;
      });
    } else {
      // Get selected parameters
      Object.keys(checkboxes).forEach(key => {
        const checkbox = checkboxes[key].querySelector(
          'input[type="checkbox"]'
        );
        selectedParams[key] = checkbox.checked;
      });
    }

    modal.remove();
    if (onSubmit) onSubmit(selectedParams);
  });

  buttonContainer.appendChild(cancelButton);
  buttonContainer.appendChild(redirectButton);

  // Assemble modal
  modalContent.appendChild(header);
  modalContent.appendChild(querySection);
  modalContent.appendChild(paramsSection);
  modalContent.appendChild(buttonContainer);
  modal.appendChild(modalContent);

  // Close on overlay click
  modal.addEventListener('click', e => {
    if (e.target === modal) {
      modal.remove();
      if (onCancel) onCancel();
    }
  });

  // Close on Escape key
  const escapeHandler = e => {
    if (e.key === 'Escape') {
      modal.remove();
      if (onCancel) onCancel();
      document.removeEventListener('keydown', escapeHandler);
    }
  };
  document.addEventListener('keydown', escapeHandler);

  // Append to body
  document.body.appendChild(modal);

  return modal;
}

/**
 * Creates a checkbox option element
 * @param {string} id - Unique identifier
 * @param {string} label - Label text
 * @param {boolean} checked - Whether checkbox is checked
 * @param {boolean} disabled - Whether checkbox is disabled
 * @returns {HTMLElement} The checkbox container element
 */
function createCheckboxOption(id, label, checked, disabled) {
  const container = document.createElement('div');
  container.style.cssText = `
    display: flex;
    align-items: center;
    padding: 8px 0;
    cursor: pointer;
  `;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = id;
  checkbox.checked = checked;
  checkbox.disabled = disabled;
  checkbox.style.cssText = `
    margin-right: 12px;
    width: 18px;
    height: 18px;
    cursor: pointer;
  `;

  const labelEl = document.createElement('label');
  labelEl.htmlFor = id;
  labelEl.textContent = label;
  labelEl.style.cssText = `
    font-size: 14px;
    color: #202124;
    cursor: pointer;
    flex: 1;
  `;

  container.appendChild(checkbox);
  container.appendChild(labelEl);

  // Make entire container clickable
  container.addEventListener('click', e => {
    if (e.target !== checkbox && !disabled) {
      checkbox.checked = !checkbox.checked;
      checkbox.dispatchEvent(new Event('change'));
    }
  });

  return container;
}
