/**
 * Module dependencies.
 */

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const session = require('express-session');

// All environments
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "/public/views/"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Middleware
// ------- Session & Notifications
app.use(session({
    secret: 'scooby',
    resave: true,
    saveUninitialized: true,
    cookie: {secure: true}
}));
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


// Db Connection
mongoose
    .connect(
        "mongodb://localhost:27017/local",
        { useNewUrlParser: true }
    )
    .then(
        () => {},
        err => {
            console.log(err);
        }
    );

// ROUTES
const routes = require("./routes/trips");

app.get("/", routes.index);
app.get("/api/trips", routes.getAllTrips);
app.post("/api/trips", routes.saveTrip);

app.get("/api/trips/new", routes.newTrip);
app.get("/api/trips/:id", routes.getTrip);
app.get("/api/trips/:id/edit", routes.getEditTrip);
app.get("/api/trips/:id/delete", routes.deleteTrip);

// Listen
app.listen(3000, () => {
    console.log("   ---> Server running on port 3000");
});
