var express = require('express');
var router = express.Router();
var User = require('../models/User.js');

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
            console.log(err);
            return res.status(400).json({ success: false, msg: err });
        } else {
            res.status(201).json({ success: true, createdAt: (req.get('host') + req.baseUrl + '/' + newAdd._id) });
        }
    });
});

router.post('/delete/', async function (req, res) {

    await User.findOneAndDelete({ id: req.body.id })
        .exec(function (err, ad) {
            if (err) {
                res.status(400).json({ success: false, msg: err });
            }
            else if (!ad) {
                res.status(404).json({ success: false, msg: 'User not found' });
            } else {
                res.json({ success: true, msg: 'User deleted' });
            }

        });
});

module.exports = router;