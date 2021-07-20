var mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  beachId: { type: String, required: [true, "Beach ID is required"] },
  userId: { type: String, required: [true, "User ID is required"] },
});

favoriteSchema.methods.toDto = function () {
  return {
    beachId: this.beachId,
    userId: this.userId,
  };
};
const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;
