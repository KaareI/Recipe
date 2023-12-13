/* Handle input and textarea field validations */
function validateInput(inputElement) {

    // Check if the input is empty
    if (inputElement.value.trim() === '') {
        // If it's empty, add the 'error' class
        inputElement.classList.add('error');

        // Remove the 'error' class after 3 seconds
        setTimeout(function () {
            inputElement.classList.remove('error');
        }, 3000);

        return true;
    } else {
        return false
    }
}

/* Validate buttons */
function validateCustom(container) {
    const elements = container.querySelectorAll('*');
    const hasActiveElement = Array.from(elements).some(element => element.classList && element.classList.contains('active'));

    if (!hasActiveElement) {
        // Add error class to the container or handle the error in your desired way
        container.classList.add('error');

        // Remove the error class after 3 seconds
        setTimeout(() => container.classList.remove('error'), 3000);

        return true;
    } else {
        return false
    }
}

/* Validate all fields */
function validateSelection() {
    let missingInformation = [];

    /* Validate recipe's name */
    const name = document.getElementById('recipeName');
    missingInformation.push(validateInput(name));

    /* Validate recipe's type */
    const type = document.getElementById('type');
    missingInformation.push(validateCustom(type));

    /* Validate recipe's time */
    const time = document.getElementById('recipeTime');
    missingInformation.push(validateInput(time));

    /* Validate recipe's category */
    const category = document.getElementById('category');
    missingInformation.push(validateCustom(category));

    /* Validate recipe's ingredients */
    const ingredients = document.getElementById('recipeIngredients');
    missingInformation.push(validateInput(ingredients));

    /* Validate recipe's instructions */
    const instructions = document.getElementById('recipeInstructions');
    missingInformation.push(validateInput(instructions));

    /* Validate recipe's image */

/*    console.log(missingInformation)*/
    // Check if there is any 'true' in the array (errors)
    if (missingInformation.includes(true)) {
        return true
    } else {
        return false
    }

}

/* Handle adding recipe */
const addRecipe = () => {

    /* Validate all fields */
    const info = validateSelection()


}

/* Handle Category selection logic */
function changeState(clickedElement) {

    const addCategoryInput = document.getElementById('addCategory');
    const categoriesDiv = document.getElementById('categories');
    const flexColumn3Div = document.getElementById('flexColumn3');

    // Check if the addCategory input length is longer than 0
    if (addCategoryInput.value.length > 0) {
        // If input has value, add class 'disabled' to categoriesDiv
        categoriesDiv.classList.add('disabled');
        flexColumn3Div.classList.add('active');

    } else {
        // If input is empty, remove class 'disabled' from categoriesDiv
        categoriesDiv.classList.remove('disabled');
        flexColumn3Div.classList.remove('active');
    }

    // Check if the clicked button has 'active' class
    if (clickedElement.classList.contains('active')) {
        // If clicked button has 'active' class, remove class 'disabled' from flexColumn3Div
        flexColumn3Div.classList.remove('disabled');
        flexColumn3Div.classList.remove('active');
    } else {
        // If clicked button doesn't have 'active' class, add class 'disabled' to flexColumn3Div
        flexColumn3Div.classList.add('disabled');
        flexColumn3Div.classList.remove('active');
    }

    // Call changeColor with the clicked element
    changeColor(clickedElement);
}


