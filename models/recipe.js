const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    const Recipe = sequelize.define('Recipe', {
        Name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        Category: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        Type: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        Time: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        Instructions: {
            type: DataTypes.STRING(1000),
            allowNull: false,
        },
        Ingredients: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
        RecipeIMG: {
            type: DataTypes.BLOB,
            allowNull: true,
        },
    }, {
        timestamps: false,
        tableName: 'recipe',
    });

    return Recipe;
};
