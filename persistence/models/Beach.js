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
  images: { type: [String], required: [true, "Images are required"] },
  latitude: { type: Number, required: [true, "Latitude is required"] },
  longitude: { type: Number, required: [true, "Longtitude is required"] },
});

beachSchema.methods.toDto = function () {
  return {
    name: this.name,
    description: this.description,
    latitude: this.latitude,
    longitude: this.longitude,
    images: this.images,
  };
};
const Beach = mongoose.model("Beach", beachSchema);

module.exports = Beach;
