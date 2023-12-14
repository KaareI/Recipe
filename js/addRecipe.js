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

    /* Validate recipe's image url */
    const imageURL = document.getElementById('recipeImage');
    missingInformation.push(validateInput(imageURL));

    /*    console.log(missingInformation)*/
    // Check if there is any 'true' in the array (errors)
    if (missingInformation.includes(true)) {
        return true
    } else {
        return false
    }

}

/* Extract the img id from the drive link */
function extractImageId(driveLink) {
    const regex = /\/d\/(.*?)\/view/;
    const match = driveLink.match(regex);

    if (match && match[1]) {
        return match[1];
    } else {
        console.error("Invalid Google Drive link");
        return null;
    }
}

/* Construct the new URL */
function constructImageUrl(imageId) {
    return `https://drive.google.com/uc?id=${imageId}`;
}

/* Get selected or made category */
function getCategory() {
    const categoriesDiv = document.getElementById('categories');
    const addCategoryInput = document.getElementById('addCategory');
    const flexColumn3Div = document.getElementById('flexColumn3');

    if (categoriesDiv.classList.contains('disabled')) {
        // Categories are disabled, return the value of addCategory input
        return addCategoryInput.value.toUpperCase();
    } else if (flexColumn3Div.classList.contains('disabled')) {
        // flexColumn3 is disabled, find the active button in categories and return its value
        const activeButton = categoriesDiv.querySelector('.active');
        return activeButton ? activeButton.value : null;
    }

    // Return null if neither condition is met
    return null;
}

/* Get selected dish type */
function getActiveButtonType() {
    const typeSection = document.getElementById('type');
    const activeButton = typeSection.querySelector('.active');

    // Check if an active button exists
    if (activeButton) {
        return activeButton.innerText.trim(); // Return the trimmed text content
    } else {
        return null; // Return null if no active button is found
    }
}

/* Handle category selection logic */
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

/* Handle adding recipe */
const addRecipe = async () => {

    /* Validate all fields */
    const error = validateSelection()
    /*        console.log(error)*/


    if (!error) {

        const name = document.getElementById('recipeName');
        /*        console.log("Name: ", name.value)
                console.log("Name: ", typeof(name.value))*/

        const type = getActiveButtonType();
        /*        console.log("type: ", type)
                console.log("type: ", typeof(type))*/

        const time = Number((document.getElementById('recipeTime').value));
        /*        console.log("time: ", time)
                console.log("time: ", typeof (time))*/

        const category = getCategory();
        /*        console.log("category: ", category);
                console.log("category: ", typeof(category));*/

        const ingredients = document.getElementById('recipeIngredients');
        /*        console.log("ingredients: ", ingredients.value)
                console.log("ingredients: ", typeof(ingredients.value))*/

        const instructions = document.getElementById('recipeInstructions');
        /*        console.log("instructions: ", instructions.value)
                console.log("instructions: ", typeof(instructions.value))*/

        let imageURL = document.getElementById('recipeImage');
        imageURL = imageURL.value.replace(/\s/g, '');
        const imageId = extractImageId(imageURL);
        imageURL = constructImageUrl(imageId);
        /*        console.log("Constructed Image URL:", imageURL);
                console.log("Constructed Image URL:", typeof(imageURL));*/

        try {
            const response = fetch('/addRecipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Name: name.value,
                    Type: type,
                    Time: time,
                    Category: category,
                    Ingredients: ingredients.value,
                    Instructions: instructions.value,
                    ImageURL: imageURL,
                }),
            });

        } catch (error) {
            console.error('Error creating recipe:', error.message);
        }

        navigateToIndex()
    }
};

const editRecipe = async (ID) => {

    /* Validate all fields */
    const error = validateSelection()
    /*        console.log(error)*/

    if (!error) {

        const name = document.getElementById('recipeName');
        /*        console.log("Name: ", name.value)
                console.log("Name: ", typeof (name.value))*/

        const type = getActiveButtonType();
        /*        console.log("type: ", type)
                console.log("type: ", typeof (type))*/

        const time = Number((document.getElementById('recipeTime').value));
        /*        console.log("time: ", time)
                console.log("time: ", typeof (time))*/

        const category = getCategory();
        /*        console.log("category: ", category);
                console.log("category: ", typeof (category));*/

        const ingredients = document.getElementById('recipeIngredients');
        /*        console.log("ingredients: ", ingredients.value)
                console.log("ingredients: ", typeof (ingredients.value))*/

        const instructions = document.getElementById('recipeInstructions');
        /*        console.log("instructions: ", instructions.value)
                console.log("instructions: ", typeof (instructions.value))*/

        let imageURL = document.getElementById('recipeImage');

        if (imageURL.value.includes('view')) {
            console.log("Constructing link")
            imageURL = imageURL.value.replace(/\s/g, '');
            const imageId = extractImageId(imageURL);
            imageURL = constructImageUrl(imageId);
        } else {
            imageURL = imageURL.value;
        }

        /*        console.log("Constructed Image URL:", imageURL);
                console.log("Constructed Image URL:", typeof (imageURL));*/

        try {
            const response = await fetch(`/editRecipe/${ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Name: name.value,
                    Type: type,
                    Time: time,
                    Category: category,
                    Ingredients: ingredients.value,
                    Instructions: instructions.value,
                    ImageURL: imageURL,
                }),
            });

        } catch (error) {
            console.error('Error updating recipe:', error.message);
        }

        navigateToRecipe(ID)

    }

}
