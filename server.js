const express = require('express');
const fs = require('fs');
const ejs = require('ejs');
const Sequelize = require('sequelize');
const path = require('path')
const {sequelize, Recipe} = require('./models');
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

// Serve the homepage
app.get('/', async (req, res) => {
    const indexPath = './views/index.ejs';

    try {

        const recipes = await Recipe.findAll();

        // Read and modify the 'index.ejs' file
        fs.readFile(indexPath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading index.ejs:', err);
                return res.status(500).json({error: 'Server error'});
            }

            data = ejs.render(data, {recipes});

            res.send(data);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({error: 'Error fetching data'});
    }
});

/* Add recipe */
app.get('/addRecipe', async (req, res) => {
    const indexPath = './views/addRecipe.ejs';

    try {

        const uniqueCategories = await Recipe.findAll({
            attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('Category')), 'Category']],
            raw: true,
        });

        console.log(uniqueCategories);

        // Read and modify the 'addRecipe.ejs' file
        fs.readFile(indexPath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading addRecipe.ejs:', err);
                return res.status(500).json({error: 'Server error'});
            }

            data = ejs.render(data, {uniqueCategories});

            res.send(data);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({error: 'Error fetching data'});
    }
});

// Serve recipe page
app.get('/recipe/:id', async (req, res) => {
    const indexPath = './views/recipe.ejs';
    const recipeId = req.params.id;

    try {
        // Find the recipe by ID
        const recipe = await Recipe.findByPk(recipeId);

        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        // Read and modify the 'recipe.ejs' file
        fs.readFile(indexPath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading recipe.ejs:', err);
                return res.status(500).json({ error: 'Server error' });
            }

            data = ejs.render(data, { recipe });

            res.send(data);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
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

