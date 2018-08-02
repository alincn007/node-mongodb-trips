const mongoose = require("mongoose");

const tripSchema = mongoose.Schema({
    startCity: {
        type: String,
        required: true
    },
    endCity: {
        type: String,
        required: [true, "No destination? Where are you going?"]
    },
    date: {
        type: Date,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: [1, "There is no such thing as a free meal"],
        max: [3000, "Too expensive. Where are you going? to the moon?"]
    },
    description: {
		type: String,
		required: function() {
			return this.price > 500;
		}
    }
});

module.exports = mongoose.model("Trip", tripSchema);
