/* Find active category */
function getActiveCategory() {
    const typeSection = document.getElementById('categories');
    const activeButton = typeSection.querySelector('.active');

    // Check if an active button exists
    if (activeButton) {
        return activeButton.innerText.trim(); // Return the trimmed text content
    } else {
        return null; // Return null if no active button is found
    }
}

/* Refresh the display when filters are changed */
async function categoryUpdate(button) {

    /* When clicked element is category button change color */
    if (button) {
        changeColor(button);
    }

    const type = document.getElementById('type').value;
    const category = getActiveCategory();
    /*    console.log("type:", type);
        console.log("category:", category);*/

    try {
        // Fetch filtered HTML based on selected type and category
        const response = await fetch(`/category?type=${type}&category=${category}`);
        const filteredHtml = await response.text();

        // Replace the content of the #recipes div
        document.getElementById('recipes').innerHTML = filteredHtml;

    } catch (error) {
        console.error('Error fetching data:', error);
    }

}

/* Remove filters */
function removeFilters() {
    const typeSection = document.getElementById('categories');
    const activeButton = typeSection.querySelector('.active');
    const type = document.getElementById('type');

    // Check if an active button exists
    if (activeButton) {
        activeButton.classList.remove('active');
    }

    // Change the default value
    type.value = "TÜÜP";

}


/* Search function handle */
function setupDelayedLogging() {
    let typingTimer;
    const inputField = document.querySelector('.search-input');

    inputField.addEventListener('input', function () {
        clearTimeout(typingTimer);

        removeFilters();

        // Check if the input is at least 3 characters
        if (inputField.value.length >= 3) {
            typingTimer = setTimeout(function () {
                const userInput = inputField.value;

                // Make a fetch request to the server for the search input
                fetch(`/search?input=${encodeURIComponent(userInput)}`)
                    .then(response => response.text())
                    .then(renderedHtml => {

                        // Update the content of the #tools div with the fetched HTML
                        document.getElementById('recipes').innerHTML = renderedHtml;

                    })
                    .catch(error => console.error('Error fetching data:', error));
            }, 1000);

            // If user has stopped typing
        }
        if (inputField.value.length === 0) {
            // Update UI for the user to show all categories
            fetch(`/category?type=TÜÜP&category=null`)
                .then(response => response.text())
                .then(renderedHtml => document.getElementById('recipes').innerHTML = renderedHtml)
                .catch(error => console.error('Error fetching data:', error));
        }


    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Initial attachment of event listeners
    setupDelayedLogging();
});