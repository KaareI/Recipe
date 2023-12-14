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

/* Render add recipe */
app.get('/addRecipe', async (req, res) => {
    const indexPath = './views/addRecipe.ejs';

    try {

        const uniqueCategories = await Recipe.findAll({
            attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('Category')), 'Category']],
            raw: true,
        });

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

/* Add recipe */
app.post('/addRecipe', async (req, res) => {
    try {

        const newRecipe = await Recipe.create(req.body);
        res.status(201).json(newRecipe);

    } catch (error) {

        console.error('Error creating recipe:', error);
        res.status(500).json({error: 'Error creating recipe'});

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
            return res.status(404).json({error: 'Recipe not found'});
        }

        // Read and modify the 'recipe.ejs' file
        fs.readFile(indexPath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading recipe.ejs:', err);
                return res.status(500).json({error: 'Server error'});
            }

            data = ejs.render(data, {recipe});

            res.send(data);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({error: 'Error fetching data'});
    }
});

/* Edit recipe */
app.get('/editRecipe:id', async (req, res) => {
    const indexPath = './views/addRecipe.ejs';

    try {

        const uniqueCategories = await Recipe.findAll({
            attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('Category')), 'Category']],
            raw: true,
        });

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

// Handle category selection
app.get('/category', async (req, res) => {
    const indexPath = './views/index.ejs';

    try {
        let recipes;

        const {type, category} = req.query;

        // Check if both category and type are not provided
        if (!category && !type) {
            return res.send('No parameters.');
        }

        // Check if type is TÜÜP
        if (type === 'TÜÜP') {
            // If category is null, send all recipes
            if (category === "null") {
                recipes = await Recipe.findAll();
            } else {
                // If category is not null, send recipes with that category
                recipes = await Recipe.findAll({
                    where: {
                        Category: category,
                    },
                });
            }
        } else {
            // If category is null, filter by type
            if (category === "null") {
                console.log("NO CATEGORY")
                recipes = await Recipe.findAll({
                    where: {
                        Type: type,
                    },
                });
            } else {
                // If category is not null, filter by both category and type
                recipes = await Recipe.findAll({
                    where: {
                        Category: category,
                        Type: type,
                    },
                });
            }
        }

        let renderedHtml;

        // Read and modify the 'index.ejs' file
        fs.readFile(indexPath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading index.ejs:', err);
                return res.status(500).json({error: 'Server error'});
            }

            renderedHtml = ejs.render(`
                ${recipes.map(recipe => `
                    <div class="recipe hoverBlack" id="${recipe.id}" onclick="navigateToRecipe(${recipe.id})">
                        <h2 class="font">${recipe.Name}</h2>
                        <img src="${recipe.ImageURL}" alt="${recipe.Name}">
                    </div>
                `).join('')}
            `, {
                recipes,
            });

            if (recipes.length === 0) {
                renderedHtml = "<h4 class='font'>Retsepti ei leitud</h4>";
            }

            res.setHeader('Content-Type', 'text/html');
            res.send(renderedHtml);
        });

    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({error: 'Error fetching data'});
    }
});

// Handle search
app.get('/search', async (req, res) => {
    const indexPath = './views/index.ejs';

    try {

        const {type, category} = req.query;


        let renderedHtml;

        // Read and modify the 'index.ejs' file
        fs.readFile(indexPath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading index.ejs:', err);
                return res.status(500).json({error: 'Server error'});
            }

            renderedHtml = ejs.render(`
                ${recipes.map(recipe => `
                    <div class="recipe hoverBlack" id="${recipe.id}" onclick="navigateToRecipe(${recipe.id})">
                        <h2 class="font">${recipe.Name}</h2>
                        <img src="${recipe.ImageURL}" alt="${recipe.Name}">
                    </div>
                `).join('')}
            `, {
                recipes,
            });

            if (recipes.length === 0) {
                renderedHtml = "<h4 class='font'>Retsepti ei leitud</h4>";
            }

            res.setHeader('Content-Type', 'text/html');
            res.send(renderedHtml);
        });

    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({error: 'Error fetching data'});
    }
});

// Endpoint for deleting a recipe by ID
app.delete('/deleteRecipe/:id', async (req, res) => {
    const recipeId = req.params.id;

    try {
        // Use Sequelize to find and delete the recipe by ID
        const deletedRecipeCount = await Recipe.destroy({
            where: {
                ID: recipeId,
            },
        });

        if (deletedRecipeCount > 0) {
            // Recipe deleted successfully
            res.status(204).send();
        } else {
            // Recipe with the specified ID not found
            res.status(404).json({ error: 'Recipe not found' });
        }
    } catch (error) {
        console.error('Error deleting recipe:', error);
        res.status(500).json({ error: 'Error deleting recipe' });
    }
});

// Handle search
app.get('/search42', (req, res) => {
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

