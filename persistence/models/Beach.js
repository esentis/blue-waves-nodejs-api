var mongoose = require("mongoose");

const beachSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, "Minimum characters required 2"],
    required: [true, "Name is required"],
  },
  countryId: String,
  description: {
    type: String,
    minlength: [3, "Minimum characters required 25"],
    required: [true, "Description is required"],
  },
  averageRating: Number,
  totalRatingSum: Number,
  ratingCount: Number,
  latitude: Number,
  longtitude: Number,
});

const Beach = mongoose.model("Beach", beachSchema);

module.exports = Beach;
