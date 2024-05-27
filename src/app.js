const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");

// Require your database connection file
require("./db/conn");

// Require your model
const Register = require("./models/ragisters");

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const views_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

// Middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up static directory to serve
app.use(express.static(static_path));

// Set up Handlebars as the view engine
app.set("view engine", "hbs");
app.set("views", views_path);
hbs.registerPartials(partials_path);

// Define your routes
app.get("/", (req, res) => {
    res.render("index");
});

// ..........
// 

app.post("/register", async (req, res) => {
    try {
        const registerEmployee = new Register({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });

        const registeredEmployee = await registerEmployee.save();
        console.log("Registration successful:", registeredEmployee);

        // Respond with JSON indicating success
        res.status(201).json({ success: true });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Define the route to render the home page
app.get("/home", (req, res) => {
    res.render("home");
});

// Add the login route
app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        // Find the user by email
        const user = await Register.findOne({ email: email });

        if (!user) {
            // User not found
            return res.status(400).send("Invalid login credentials.");
        }

        // Check if the password matches
        if (user.password !== password) {
            // Password does not match
            return res.status(400).send("Invalid login credentials.");
        }

        // Login successful, redirect to home page
        res.status(200).redirect("/home");
    } catch (error) {
        res.status(500).send("Internal server error.");
    }
});

// Listen on the specified port
app.listen(port, () => {
    console.log(`Server is running at port no ${port}`);
});
