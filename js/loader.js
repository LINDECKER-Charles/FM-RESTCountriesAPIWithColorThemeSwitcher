// DOM element references
const content = document.getElementById('content');
const filter = document.getElementById('filter');
const search = document.getElementById("search");

/**
 * Loads a JSON file by name.
 * @param {string} name - The name of the JSON file (without extension).
 * @returns {Promise<Object[]>} - Parsed JSON data.
 */
async function loadJSON(name) {
  try {
    const response = await fetch(`${name}.json`);
    if (!response.ok) throw new Error('Error loading JSON');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Populates the region filter select with unique region values from the JSON data.
 */
async function loadSelect() {
  const json = await loadJSON('data');
  let regions = [];
  let html = '';

  json.forEach(item => {
    if (!regions.includes(item['region'])) {
      regions.push(item['region']);
      html += `<option value="${item['region']}" class="text-left font-semibold">${item['region']}</option>`;
    }
  });

  // Default placeholder option (disabled & hidden)
  html += '<option value="0" disabled selected hidden class="text-center">Filter by Region</option>';

  // "All" option to reset filter
  html += '<option value="" class="text-left font-semibold">All</option>';

  filter.innerHTML = html;
}

/**
 * Filters and renders country data based on selected region and search input.
 * @param {string} region - The selected region value.
 * @param {string} name - The entered name for search.
 */
async function formatData(region, name) {
  content.innerHTML = ''; // Clear previous content
  const json = await loadJSON('data');
  let html = '';

  json.forEach(item => {
    // Match region and name filters (case-insensitive)
    if (!region || item['region'] === region) {
      if (!name || item['name'].toLowerCase().includes(name.toLowerCase())) {
        html += `
          <article class="shadow-soft-full object-contain gap-5 rounded-md dark:text-white dark:shadow-hard-full dark:bg-grey-400">
            <img src="${item['flags']['png']}" alt="${item['name']} flags" class="rounded-t-md">
            <div class="p-6 mb-6">
              <h2 class="font-bold mb-6 text-lg">${item['name']}</h2>
              <ul>
                <li><span class="font-semibold">Population: </span>${item['population']}</li>
                <li><span class="font-semibold">Region: </span>${item['region']}</li>
                <li><span class="font-semibold">Capital: </span>${item['capital']}</li>
              </ul>
            </div>
          </article>`;
      }
    }
  });

  content.innerHTML = html; // Inject all rendered HTML at once
}

/**
 * Handles changes from either the region select or the search input.
 */
function handleFilters() {
  formatData(filter.value, search.value);
}

// Event listeners for region and search filters
filter.addEventListener('change', handleFilters);
search.addEventListener('change', handleFilters);

// Initial data load
formatData(false, false); // Load all countries on initial load
loadSelect();             // Populate the region select options
