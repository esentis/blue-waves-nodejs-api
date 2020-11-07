var express = require('express');
var router = express.Router();
var User = require('../models/User.js');

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
            logger.error(`New user created at ${req.get('host') + req.baseUrl + '/' + newAdd._id}`);
            res.status(201).json({ success: true, createdAt: (req.get('host') + req.baseUrl + '/' + newAdd._id) });
        }
    });
});

router.post('/delete/', async function (req, res) {

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
                logger.success(`User successfuly deleted.`);
                res.json({ success: true, msg: 'User successfuly deleted.' });
            }

        });
});

module.exports = router;