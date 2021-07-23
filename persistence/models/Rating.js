var mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  beachId: { type: String, required: [true, "Beach ID is required"] },
  userId: { type: String, required: [true, "User ID is required"] },
  rating: {
    type: Number,
    required: [true, "Rating is required"],
    min: 0,
    max: 10,
  },
  review: String,
});

ratingSchema.methods.toDto = function () {
  return {
    beachId: this.beachId,
    userId: this.userId,
    rating: this.rating,
    review: this.review,
  };
};
const Rating = mongoose.model("Rating", ratingSchema);

module.exports = Rating;
