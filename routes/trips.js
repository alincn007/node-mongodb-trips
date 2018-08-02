const mongoose = require("mongoose");

// models
let Trip = require("./../models/trip");

/*
 * GET trips listing.
 */

module.exports = {
    index: (req, res) => {
        res.render("pages/index");
    },

    getAllTrips: (req, res) => {
        Trip.find((err, trips) => {
            res.render("pages/trips/list", { trips: trips });
        });
    },

    getTrip: (req, res) => {
        const filters = { _id: mongoose.Types.ObjectId(req.params.id) };

        Trip.findOne(filters, (err, trip) => {
            if (!trip) return res.status(404).send("Trip not found!");
            res.render("pages/trips/details", { model: trip });
        });
    },

    saveTrip: (req, res) => {
        var data = {
            startCity: req.body.startCity,
            endCity: req.body.endCity,
            price: req.body.price,
            date: req.body.date,
            description: req.body.description
        };

        if (req.body.id) data._id = req.body.id;
        let trip = new Trip(data);

        // Validation
        var error = trip.validateSync();
        if (error && error.errors) {
            for (key in error.errors) {
                req.flash("danger", error.errors[key].message);
            }
            return res.render("pages/trips/edit", { model: req.body.id ? trip : data });
        }

        // Update
        if (req.body.id) {
            trip.update(trip, (err, trip) => {
                if (err) {
                    req.flash("danger", err);
                    return res.render("pages/trips/edit", { model: trip });
                }
                
                req.flash("success", "Your trip was saved!");
                res.redirect("/api/trips");
            });
            // Insert
        } else {
            req.flash("success", "Your trip was saved!");
            Trip.create(data, (err, data) => {
                if (!err) req.flash("success", "Your trip was saved!");
                res.redirect("/api/trips");
            });
        }
    },

    getEditTrip: (req, res) => {
        const filters = { _id: mongoose.Types.ObjectId(req.params.id) };

        Trip.findOne(filters, (err, trip) => {
            if (!trip) return req.error("Could not find trip");

            res.render("pages/trips/edit", { model: trip });
        });
    },

    newTrip: (req, res) => {
        res.render("pages/trips/edit", { model: {} });
    },

    deleteTrip: (req, res) => {
        const query = { _id: mongoose.Types.ObjectId(req.params.id) };

        Trip.findOne(query, (err, trip) => {
            if (trip) {
                trip.remove();
                req.flash("success", "Your trip was removed!");
                res.redirect("/api/trips");
            } else {
                req.flash("danger", "Your trip was not found!");
                res.redirect("/api/trips");
            }
        });
    }
};
