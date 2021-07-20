var mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  beachId: { type: String, required: [true, "Beach ID is required"] },
  userId: { type: String, required: [true, "User ID is required"] },
  rating: { type: Number, required: [true, "Rating is required"] },
});

ratingSchema.methods.toDto = function () {
  return {
    beachId: this.beachId,
    userId: this.userId,
    rating: this.rating,
  };
};
const Rating = mongoose.model("Rating", ratingSchema);

module.exports = Rating;
