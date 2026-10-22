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