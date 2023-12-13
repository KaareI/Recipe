/* Clicked button color */
function changeColor(clickedButton) {
    // Get the parent div (button container)
    const buttonContainer = clickedButton.parentNode;
/*    console.log("Button parent container:", buttonContainer);*/

    const isActive = clickedButton.classList.contains('active');

    // Reset color and border-color for all buttons in the same div
    const buttons = buttonContainer.querySelectorAll('button');
    buttons.forEach(button => {
        button.classList.remove('active');
    });

/*    console.log("Clicked button:", clickedButton);*/
    if (!isActive) {
        // Set color and border-color for the clicked button
        clickedButton.classList.add('active');
    }

}
