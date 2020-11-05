var express = require('express');
var router = express.Router();
var Beach = require('../models/Beach.js');
var Rating = require('../models/Rating.js');




router.post('/add', async function (req, res) {

    var rating = await Rating.findOne({ beachId: req.body.beachId, userId: req.body.userId }).exec();
    if (rating != null) {
        console.log('You have already rated');
        return res.status(400).json({ success: false, msg: 'You have already rated !' });
    }

    const newRating = new Rating({
        beachId: req.body.beachId,
        rating: req.body.rating,
        userId: req.body.userId
    })

    await newRating.save(function (err, newAdd) {
        if (err) {
            console.log(err);
            return res.status(400).json({ success: false, msg: err });
        } else {
            res.status(201).json({ success: true, createdAt: (req.get('host') + req.baseUrl + '/' + newAdd._id) });
        }
    });
});

router.post('/search', async function (req, res) {
    var beachId = req.body.beachId;
    // Restricts search term's length to avoid unnecessary document reads.
    if (beachId.length <= 4) {
        res.status(404).json({ success: false, msg: "At least 4 characters are needed to perform search" });
    } else {

        var ratings = await Rating.find({ 'beachId': beachId }).exec();
        res.json({
            results: ratings
        });
    }
})

module.exports = router;