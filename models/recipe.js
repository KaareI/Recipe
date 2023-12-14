const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    const Recipe = sequelize.define('Recipe', {
        ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
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
        ImageURL: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
    }, {
        timestamps: false,
        tableName: 'recipe',
    });

    return Recipe;
};
