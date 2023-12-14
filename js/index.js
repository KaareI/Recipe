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