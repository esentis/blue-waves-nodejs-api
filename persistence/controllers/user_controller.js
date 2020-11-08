var express = require('express');
var router = express.Router();
var User = require('../models/User.js');
var Rating = require('../models/Rating.js');
var Favorite = require('../models/Favorite.js');

const logger = require('../helpers/loggers.js');

router.post('/add', async function (req, res) {

    const newUser = new User({
        username: req.body.username,
        karma: 0,
        role: 'user',
        id: req.body.id,
        joinDate: req.body.joinDate,
    })

    await newUser.save(function (err, newAdd) {
        if (err) {
            logger.error(`Something went wrong ! ${err}`);
            return res.status(400).json({ success: false, msg: err });
        } else {
            logger.success(`New user created at ${req.get('host') + req.baseUrl + '/' + newAdd._id}`);
            res.status(201).json({ success: true, createdAt: (req.get('host') + req.baseUrl + '/' + newAdd._id) });
        }
    });
});

router.post('/delete/', async function (req, res) {
    logger.info(`Request to delete user with ID: ${req.body.id}`);
    await Rating.deleteMany({ userId: req.body.id })
        .exec(function (err, ratings) {
            if (err) {
                logger.error(`Something went wrong ! ${err}`);
            }
            else if (!ratings) {
                logger.error(`User has no ratings.`);
            } else {
                logger.warn(`${ratings.deletedCount} ratings deleted.`);

            }

        });

    await Favorite.deleteMany({ userId: req.body.id })
        .exec(function (err, favorites) {
            if (err) {
                logger.error(`Something went wrong ! ${err}`);
            }
            else if (!favorites) {
                logger.error(`User has no favorites.`);
            } else {
                logger.warn(`${favorites.deletedCount} favorites deleted.`);
            }

        });

    await User.findOneAndDelete({ id: req.body.id })
        .exec(function (err, user) {
            if (err) {
                logger.error(`Something went wrong ! ${err}`);
                res.status(400).json({ success: false, msg: err });
            }
            else if (!user) {
                logger.error(`User not found in database.`);
                res.status(404).json({ success: false, msg: 'User not found in database.' });
            } else {
                logger.success(`User has been successfully deleted.`);
                res.json({ success: true, msg: 'User successfuly deleted.' });
            }

        });
});

module.exports = router;