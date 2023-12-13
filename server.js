const express = require('express');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path')
const { sequelize, Recipe } = require('./models');
const app = express();
const PORT = 5501;

app.use(express.json());
// Serve the CSS nad JS files
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
// Serve the images
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get('/recipes', async (req, res) => {
    try {
        // Retrieve all recipes
        const recipes = await Recipe.findAll();

        // Send the recipes as JSON response
        res.json(recipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/* Add recipe */
app.get('/addRecipe', async (req, res) => {
    const indexPath = './views/addRecipe.ejs';

    try {

        // Read and modify the 'addRecipe.ejs' file
        fs.readFile(indexPath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading addRecipe.ejs:', err);
                return res.status(500).json({error: 'Server error'});
            }

            res.send(data);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({error: 'Error fetching data'});
    }
});

// Serve the homepage
app.get('/', async (req, res) => {
    const indexPath = './views/index.ejs';

    try {

        // Read and modify the 'index.ejs' file
        fs.readFile(indexPath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading index.ejs:', err);
                return res.status(500).json({error: 'Server error'});
            }

            res.send(data);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({error: 'Error fetching data'});
    }
});

// Handle category selection
app.get('/Category:category', async (req, res) => {

    try {
        // Fetch AI data from the '/AIData' endpoint
        const aiResponse = await fetch('http://localhost:5501/AIData');
        const aiData = await aiResponse.json();

        // Check if any categories are selected
        const selectedCategories = req.params.category || '';
        const selectedCategoriesArray = selectedCategories.split(',');

        let filteredData = aiData;

        // Only filter AI data based on selected categories if categories are selected
        if (selectedCategoriesArray.length > 0 && selectedCategoriesArray[0].trim() !== ':') {

            // Filter AI data based on selected categories
            filteredData = aiData.filter(tool =>
                tool.Category.split(',').some(category => selectedCategories.includes(category.trim()))
            );
        }

        // Use EJS to render the HTML
        const renderedHtml = ejs.render(`
                ${filteredData.map(tool => `
                    <div class="relatedBox hoverable" id="${tool.ToolID}">
                        <div class="imgBox">
                            <img src="../assets/toolsIMG/${tool.ToolName}.png" alt="${tool.ToolName}">
                        </div>
                        <div class="definitionBox">
                            <h4>${tool.ToolName}</h4>
                            <p>${tool.Description.substring(0, 195)} . . .</p>
                        </div>
                        <div class="categoriesBox">
                            ${tool.Category.split(',').map(category => `
                                <div class="category">${category.trim()}</div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
        `, {
            aiData: filteredData,
        });

        // Set the response content type to HTML
        res.setHeader('Content-Type', 'text/html');
        res.send(renderedHtml);
    } catch (error) {
        console.error('Error fetching AI data:', error);
        res.status(500).json({error: 'Error fetching AI data'});
    }
});

// Handle search
app.get('/search', (req, res) => {
    try {
        const userInput = req.query.input; // Assuming the user input is passed as a query parameter named 'input'

        // Check if the user input is at least 3 characters
        if (userInput.length < 3) {
            return res.send('Please enter at least 3 characters for search.');
        }

        // Fetch data from the 'tools' table based on the user input
        const query = `
            SELECT \`ToolID\`, \`ToolName\`, \`Description\`, \`Category\`
            FROM \`tools\`
            WHERE LOWER(\`ToolName\`) LIKE ?
               OR LOWER(\`Category\`) LIKE ?
        `;
        const values = [`%${userInput.toLowerCase()}%`, `%${userInput.toLowerCase()}%`];

        db.query(query, values, (err, matchedTools) => {
            if (err) {
                console.error('Error fetching data:', err);
                return res.status(500).json({error: 'Error fetching data'});
            }

            if (matchedTools.length > 0) {
                // Use EJS to render the HTML with the matched tools
                const renderedHtml = ejs.render(`
            ${matchedTools.map(tool => `
              <div class="relatedBox hoverable" id="${tool.ToolID}">
                <div class="imgBox">
                  <img src="../assets/toolsIMG/${tool.ToolName}.png" alt="${tool.ToolName}">
                </div>
                <div class="definitionBox">
                  <h4>${tool.ToolName}</h4>
                  <p>${tool.Description.substring(0, 195)} . . .</p>
                </div>
                <div class="categoriesBox">
                  ${tool.Category.split(',').map(category => `
                    <div class="category">${category.trim()}</div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
        `, {
                    aiData: matchedTools,
                });

                // Set the response content type to HTML
                res.setHeader('Content-Type', 'text/html');
                res.send(renderedHtml);
            } else {
                res.send('No matches found.');
            }
        });
    } catch (error) {
        console.error('Error fetching data:', error);

        // Log the error details
        console.error(error);

        res.status(500).json({error: 'Error fetching data'});
    }
});

// Serve tool page
app.get('/Tool/:id', async (req, res) => {
    try {
        const toolId = req.params.id;

        const toolResponse = await fetch(`http://localhost:5501/AIData/${toolId}`);
        const toolData = await toolResponse.json();

        // Fetch all tools
        const allToolsResponse = await fetch('http://localhost:5501/AIData/');
        const allToolsData = await allToolsResponse.json();

        // Filter related tools based on category (excluding the clicked tool itself)
        const relatedTools = allToolsData.filter(tool => tool.Category.includes(toolData.Category) && tool.ToolID !== toolData.ToolID).slice(0, 3);


        const toolPath = './html/tool.ejs';

        fs.readFile(toolPath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading tool.ejs:', err);
                return res.status(500).json({error: 'Server error'});
            }

            // Replace buttons based on authentication status
            if (req.session && req.session.isAuthenticated) {

                // Only add logoutButton and addTool button
                data = data.replace(
                    '<div class="navButtons">',
                    '\
                    <div class="navButtons">\n\
                        <a href="">\n\
                            <img id="addTool" class="hoverable" src="../assets/add.png" alt="PLUS ICON" width="30" height="30">\n\
                        </a>\n\
                        <a href="/">\n\
                            <img id="logoutButton" class="hoverable" src="../assets/Logout.png" alt="LOGOUT" width="30" height="30">\n\
                        </a>\
                        '
                );

                // Add edit and delete buttons
                data = data.replace(
                    '<div class="action">',
                    '<div class="action">\n\
                        <img src="../assets/Edit.png" class="hoverable" id="editTool" alt="EDIT" width="35" height="35">\n\
                        <img src="../assets/Delete.png" class="hoverable" id="deleteTool" alt="DELETE" width="35" height="35">'
                );

            } else {

                // Only add loginButton
                data = data.replace(
                    '<div class="navButtons">',
                    '\
                    <div class="navButtons">\n\
                        <a href="AILogin">\n\
                            <img id="loginButton" class="hoverable" src="../assets/user-logo.png" alt="USER LOGO" width="30" height="30">\n\
                        </a>\
                        '
                );

                // Remove edit and delete buttons
                data = data.replace(
                    '<div class="action">',
                    ''
                );

            }

            // Replace placeholders in the EJS template with dynamic data for the specific tool
            data = ejs.render(data, {toolData, relatedTools});

            res.send(data);
        });
    } catch (error) {
        console.error('Error fetching tool data:', error);
        res.status(500).json({error: 'Error fetching tool data'});
    }
});
