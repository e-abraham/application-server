const {sequelize} = require('../db')
const {Restaurant} = require('./Restaurant')
const {Menu} = require('./Menu')
const {Item} = require('./Item')

//associations - What are they?
Menu.belongsTo(Restaurant) //Q: What will .belongsTo provide Menu? foreign key restaurant_id
Restaurant.hasMany(Menu)

Item.belongsTo(Menu)
Menu.hasMany(Item) // what does hasMany provide for us? Menu static methods

module.exports = { Restaurant, Menu, Item } //exporting models w/ associations
