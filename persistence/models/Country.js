var mongoose = require("mongoose");

const countrySchema = new mongoose.Schema({
  name: { type: String, required: [true, "Country name is required"] },
  iso: { type: String, required: [true, "ISO is required"] },
  currency: { type: String, required: [true, "Currency is required"] },
  description: { type: String, required: [true, "Description is required"] },
  latitude: { type: Number, required: [true, "Country latitude is required"] },
  longitude: {
    type: Number,
    required: [true, "Country longitude is required"],
  },
});

countrySchema.methods.toDto = function () {
  return {
    name: this.name,
    iso: this.iso,
    currency: this.currency,
    description: this.description,
    latitude: this.latitude,
    longitude: this.longitude,
  };
};
const Country = mongoose.model("Country", countrySchema);

module.exports = Country;
