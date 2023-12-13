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