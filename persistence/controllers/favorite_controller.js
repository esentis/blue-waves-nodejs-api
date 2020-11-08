var express = require('express');
var router = express.Router();
var Favorite = require('../models/Favorite.js');

const logger = require('../helpers/loggers.js');


router.post('/add', async function (req, res) {

    var favorite = await Favorite.findOne({ beachId: req.body.beachId, userId: req.body.userId }).exec();
    if (favorite != null) {
        await Favorite.deleteOne({ beachId: req.body.beachId, userId: req.body.userId })
            .exec(function (err, favorites) {
                if (err) {
                    logger.error(`Something went wrong ! ${err}`);
                }
                else if (!favorites) {
                    logger.error(`User has no favorites.`);
                } else {
                    logger.warn(`Beach has been removed from favorites list.`);
                    return res.status(204).json({ success: false, msg: 'Beach has been removed from favorites.' });
                }

            });

    } else {
        const newFavorite = new Favorite({
            beachId: req.body.beachId,
            userId: req.body.userId
        })

        await newFavorite.save(function (err, newAdd) {
            if (err) {
                logger.error(`Something went wrong ! ${err}`)
                return res.status(400).json({ success: false, msg: err });
            } else {
                logger.success(`Beach with ID ${req.body.beachId} has been favorited`);
                res.status(201).json({ success: true, createdAt: (req.get('host') + req.baseUrl + '/' + newAdd._id) });
            }
        });
    }

});

// Searches for a specific user's favorited beaches.
router.post('/search', async function (req, res) {
    var userId = req.body.userId;
    var beachId = req.body.beachId;
    // Restricts search term's length to avoid unnecessary document reads.
    if (userId.length <= 4) {
        logger.error(`At least 4 characters are needed to perform search`);
        res.status(404).json({ success: false, msg: "At least 4 characters are needed to perform search" });
    } else {
        var favorites = await Favorite.find({ userId: userId, beachId: beachId }).exec();
        logger.warn(`${favorites.length == 0 ? 'Beach is not favorited by the user.' : 'Beach is favorited.'}`);
        res.json({
            results: favorites
        });
    }
})

module.exports = router;