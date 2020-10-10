var mongoose = require('mongoose');

const beachSchema = new mongoose.Schema({
    name: { type: String, minlength: [3, 'Minimum characters required 3'], required: [true, 'Name is required'] },
    description: { type: String, minlength: [3, 'Minimum characters required 25'], required: [true, 'Description is required'] },
    img: { type: String, required: [true, 'Image is required'] },
    latitude: { type: Number, required: [true, 'Latitude is required'] },
    longtitude: { type: Number, required: [true, 'Longtitude is required'] },
    voteCount: { type: Number },
    rating: { type: Number },
});

beachSchema.methods.toDto = function () {
    return {
        name: this.name,
        description: this.description,
        latitude: this.latitude,
        longtitude: this.longtitude,
        voteCount: this.voteCount,
        rating: this.rating,
        img: this.img
    }
}
const Beach = mongoose.model('Beach', beachSchema);

module.exports = Beach;