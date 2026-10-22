// Leave JavaScript behavior empty or minimal for Part 1 as requested, 
// wiring up clear input interaction elements.

const searchInput = document.getElementById('search-input');
const clearBtn = document.getElementById('clear-btn');

searchInput.addEventListener('input', () => {
    if (searchInput.value.trim().length > 0) {
        clearBtn.style.display = 'block';
    } else {
        clearBtn.style.display = 'none';
    }
});

clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.style.display = 'none';
    searchInput.focus();
});
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const clearBtn = document.getElementById('clear-btn');
const resultsContainer = document.getElementById('results');
const resultCountDisplay = document.getElementById('result-count');
const chips = document.querySelectorAll('.chip');

// 1. Clear button interaction logic from Part 1
searchInput.addEventListener('input', () => {
    if (searchInput.value.trim().length > 0) {
        clearBtn.style.display = 'block';
    } else {
        clearBtn.style.display = 'none';
    }
});

clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.style.display = 'none';
    searchInput.focus();
});

// 2. Handle Form Submit (Catch Search)
searchForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent page reload
    const query = searchInput.value.trim();

    // 4. Ignore empty searches
    if (!query) return;

    await fetchAndRenderImages(query);
});

// 3. Wire up category / quick-pick chips (Enhancement)
chips.forEach(chip => {
    chip.addEventListener('click', () => {
        const query = chip.textContent.trim();
        searchInput.value = query;
        clearBtn.style.display = 'block';
        fetchAndRenderImages(query);
    });
});

// Main Fetch and Render Logic
async function fetchAndRenderImages(query) {
    // Clear old results so they don't pile up
    resultsContainer.innerHTML = '';
    resultCountDisplay.textContent = `Searching for "${query}"...`;

    // Wikimedia Commons API endpoint for image search
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(query)}&gsrlimit=15&prop=imageinfo&iiprop=url|size&format=json&origin=*`;

    try {
        const response = await fetch(url);

        // Check response.ok
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const pages = data.query ? data.query.pages : {};
        const items = Object.values(pages);

        if (items.length === 0) {
            resultCountDisplay.textContent = `No results found for "${query}".`;
            resultsContainer.innerHTML = `
                <div class="empty-state">
                    <p>No images found matching "${query}". Try another search!</p>
                </div>
            `;
            return;
        }

        // Enhancement: Display result count
        resultCountDisplay.textContent = `Showing ${items.length} results for "${query}"`;

        // Loop over returned items and render cards
        items.forEach(item => {
            if (item.imageinfo && item.imageinfo[0]) {
                const imageUrl = item.imageinfo[0].url;
                // Clean up title (remove "File:" prefix)
                const title = item.title ? item.title.replace(/^File:/, '').replace(/\.\w+$/, '') : 'Untitled';

                // Build card elements using document.createElement(...)
                const card = document.createElement('div');
                card.className = 'image-card';

                const img = document.createElement('img');
                img.src = imageUrl;
                img.alt = title;
                img.loading = 'lazy';

                const caption = document.createElement('p');
                caption.className = 'card-title';
                caption.textContent = title;

                card.appendChild(img);
                card.appendChild(caption);
                resultsContainer.appendChild(card);
            }
        });

    } catch (error) {
        console.error('Error fetching images:', error);
        resultCountDisplay.textContent = 'Failed to load images. Please try again.';
    }
}
