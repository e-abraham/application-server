const { response } = require("express");
const express = require("express");
const path = require('path'); //a node native module
const { Restaurant, Menu, Item } = require('./models/index');

const app = express();
const port = 3000;

//Q: What does express.static help us do? connect to html and css files
//Q: What do you think path.join helps us do? create path to public folder
app.use(express.static(path.join(__dirname, 'public')))

//will add routes
app.get("/menus", async (req, res) => {
    //goes into db looks for all menus
    const allMenus = await Menu.findAll()
    //server responds w/all menus in db
    res.json(allMenus)
})
//will add routes
app.get("/flipcoin", async (req, response) => {
    const randomNum = Math.floor(Math.random() * 2)
    const coin = ["heads", "tails"][randomNum]
    // res.json(coin) appears in quotes
    response.send(coin) //no quotes just text
})

app.get("/restaurants", async (req, res) => {
    const allRestaurants = await Restaurant.findAll()
    res.json(allRestaurants)
})

//Q: What will our server be doing? listening to port 3000
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
