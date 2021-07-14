const { Sequelize } = require('sequelize'); //Q: Why is this Sequelize capitalized? accessing sequelize library
const path = require('path'); //a node native module

//Q: What are we creating down below? specific sequelize db for this project, using sqlite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'db.sqlite'), //quick way to get the path for our db
});

//Q: Why are we exporting lowercase sequelize? want project files to connect to sequelize db
module.exports = {sequelize};
