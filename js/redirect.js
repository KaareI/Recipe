function navigateToAddRecipe() {
    window.location.href = 'http://localhost:5501/addRecipe';
}

function navigateToIndex() {
    window.location.href = 'http://localhost:5501/';
}

function navigateToRecipe(recipeId) {
    // Use JavaScript to navigate to the recipe page with the given ID
    window.location.href = `http://localhost:5501/recipe/${recipeId}`;
}

function navigateToEdit(ID) {
    window.location.href = `/editRecipe/${ID}`;
}

async function deleteNavigateToIndex(ID) {
    try {
        // Fetch to the server endpoint for deleting a recipe by ID
        const response = await fetch(`/deleteRecipe/${ID}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            // Deletion successful, navigate to the index or perform any other action
            navigateToIndex();
        } else {
            // Handle errors
            console.error('Error deleting recipe:', response.statusText);
        }
    } catch (error) {
        console.error('Error deleting recipe:', error.message);
    }
}
