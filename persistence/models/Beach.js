var mongoose = require("mongoose");

const beachSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, "Minimum characters required 2"],
    required: [true, "Name is required"],
  },
  countryId: { type: String, required: [true, "Country ID is required"] },
  description: {
    type: String,
    minlength: [3, "Minimum characters required 25"],
    required: [true, "Description is required"],
  },
  latitude: { type: Number, required: [true, "Latitude is required"] },
  longtitude: { type: Number, required: [true, "Longtitude is required"] },
});

const Beach = mongoose.model("Beach", beachSchema);

module.exports = Beach;
