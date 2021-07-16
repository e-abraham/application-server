const { response } = require("express");
const express = require("express");
const path = require('path'); //a node native module
const { sequelize } = require("./db");
const { Restaurant, Menu, Item } = require('./models/index');
const { check, validationResult } = require("express-validator"); //add validation to routes

const app = express();
const port = 3000;

// Add this boilerplate middleware to successfully use req.body
app.use(express.json())

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
    const coin = ["heads", "tails"][Math.floor(Math.random() * 2)]
    // res.json(coin) //appears in quotes
    response.send(coin) //no quotes just text
})

app.get("/restaurants", async (req, res) => {
    const allRestaurants = await Restaurant.findAll()
    res.json(allRestaurants)
})

app.get("/items", async (req, res) => {
    const allItems = await Item.findAll()
    res.json(allItems)
})

app.get("/restaurants/:id", async (req, res) => {
    //General querying with association using include
    let restaurant = await Restaurant.findByPk(req.params.id, {include : Menu})
    res.json({restaurant})
})

app.get("/menus/:id", async (req, res) => {
    let menu = await Menu.findByPk(req.params.id, {include : Item})
    res.json({menu})
})

app.get("/items/:id", async (req, res) => {
    let item = await Item.findByPk(req.params.id)
    res.json({item})
})

//Get Restaurant by name, using WHERE
app.get('/restaurants/name/:name', async (req, res) => {
    const restaurant = await Restaurant.findAll({
        where: {
            name : req.params.name
        }
    });
    res.json({ restaurant })
})

app.get('/menus/title/:title', async (req, res) => {
    const menu = await Menu.findAll({
        where: {
            title : req.params.title
        }
    })
    res.json({ menu })
})

app.get('/items/name/:name', async (req, res) => {
    const item = await Item.findAll({
        where: {
            name : req.params.name 
        }
    })
    res.json({ item })
})

// Post Restaurant to db, json in request body
app.post("/restaurants", [
    check("name")
    .not().isEmpty()
    .trim()
    .isLength({max: 49})
    .escape()
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    let newRestaurant = await Restaurant.create(req.body)
    res.send("Created a new Restaurant.")
})

app.post("/menus", async (req, res) => {
    let newMenu = await Menu.create(req.body)
    res.send("Created a new Menu.")
})

app.post("/items", [
    check("image")
    .isURL({require_protocol: true})
    .trim()
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    let newItem = await Item.create(req.body)
    res.send("Created a new Item.")
})

// Delete a Restaurant by id
app.delete('/restaurants/:id', async (req, res) => {
	await Restaurant.destroy({
		where : {id : req.params.id} // Destroy a Restaurant where this object matches
	})
	res.send("Deleted matching Restaurant!!")
})

app.delete('/menus/:id', async (req, res) => {
	await Menu.destroy({
		where : {id : req.params.id}
	})
	res.send("Deleted matching Menu!!")
})

app.delete('/items/:id', async (req, res) => {
	await Item.destroy({
		where : {id : req.params.id}
	})
	res.send("Deleted matching Item!!")
})

// Update a Restaurant by id, json in request body
app.put("/restaurants/:id", async (req, res) => {
	let updated = await Restaurant.update(req.body, {
		where : {id : req.params.id} // Update a Restaurant where the id matches, based on req.body
	})
	res.send("Updated matching Restaurant!!")
})

app.put("/menus/:id", async (req, res) => {
	let updated = await Menu.update(req.body, {
		where : {id : req.params.id}
	})
	res.send("Updated matching Menu!!")
})

app.put("/items/:id", async (req, res) => {
	let updated = await Item.update(req.body, {
		where : {id : req.params.id}
	})
	res.send("Updated matching Item!!")
})

//Update Restaurant attribute(s) by id, json in request body
app.patch("/restaurants/:id", async (req, res) => {
    let modified = await Restaurant.update(req.body, {
        where : {id : req.params.id} // Update a Restaurant where the id matches, based on req.body
    })
    res.send("Updated attribute(s) in matching Restaurant")
})

app.patch("/menus/:id", async (req, res) => {
    let modified = await Menu.update(req.body, {
        where : {id : req.params.id}
    })
    res.send("Updated attribute(s) in matching Menu")
})

app.patch("/items/:id", async (req, res) => {
    let modified = await Item.update(req.body, {
        where : {id : req.params.id}
    })
    res.send("Updated attribute(s) in matching Item")
})

//Q: What will our server be doing? listening to port 3000
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
    console.log("dirname: " + __dirname)
    console.log("path.join: " + path.join(__dirname, 'public'))
});

/* Curl Request Workaround

// Post a restaurant of KFC
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"name":"KFC","location":"Texas","cuisine":"FastFood"}' \
  http://localhost:3000/restaurants

  // GET all restaurants
curl --request GET \
http://localhost:3000/restaurants

// UPDATE restaurant 4 to have cuisine Japanese
curl --header "Content-Type: application/json" \
  --request PUT \
  --data '{"name":"Sushi Kadan","location":"Texas","cuisine":"Japanese"}' \
  http://localhost:3000/restaurants/4

// Delete Restaurant 5 KFC
curl --request DELETE \
http://localhost:3000/restaurants/5
*/