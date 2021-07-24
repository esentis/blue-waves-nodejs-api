var mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  beachId: { type: String, required: [true, "Beach ID is required"] },
  url: { type: String, required: [true, "Image URL is required"] },
});

imageSchema.methods.toDto = function () {
  return {
    beachId: this.beachId,
    url: this.url,
  };
};
const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
