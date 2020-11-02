var express = require('express');
var router = express.Router();
var Beach = require('../models/Beach.js');
const escapeRegex = require('../helpers/escape_regex.js')

router.get('/', async function (req, res) {

    // Destructures page and limit and set default values if not provided.
    var { page = 1, limit = 10 } = req.query;

    // Flutter for some reason tranlates null as  ''
    if (req.query.limit == '') {
        limit = 10;
    }
    if (req.query.page == '') {
        page = 1;
    }
    // Gets total documents in the Ads collection.
    const count = await Beach.countDocuments();
    var totalpages = Math.ceil(count / limit);

    // If page provided doesn't exist.
    if (req.query.page != undefined) {
        if (req.query.page > totalpages) {
            res.status(404).json({ success: false, msg: `Page ${req.query.page} doesn't exist` }).end();
        } else {
            const ads = await Beach.find().limit(limit * 1).skip((page - 1) * limit).exec();
            var beachesDto = [];
            ads.forEach(ad => {
                beachesDto.push(ad.toDto());
            })
            res.json({
                beaches: beachesDto,
                totalPages: totalpages,
                currentPage: page
            });
        }
        // If page exists, we limit the results and show the page accordingly.
    } else {
        const beaches = await Beach.find().limit(limit * 1).skip((page - 1) * limit).exec();
        beachesDto = [];
        beaches.forEach(beach => {
            beachesDto.push(beach.toDto());
        })
        res.json({
            beaches: beachesDto,
            totalPages: totalpages,
            currentPage: page
        });
    }
});

router.get('/all', async function (req, res) {
    const beaches = await Beach.find().exec();
    beachesDto = [];
    beaches.forEach(beach => {
        beachesDto.push(beach.toDto());
    });
    res.json({
        beaches: beachesDto,
    });
});

router.post('/search', async function (req, res) {
    var term = escapeRegex(req.body.term);
    // Restricts search term's length to avoid unnecessary document reads.
    if (term.length <= 4) {
        res.status(404).json({ success: false, msg: "At least 4 characters are needed to perform search" });
    } else {
        // Performs a LIKE query with $regex. The 'i' at options makes it case insensitive
        var beaches = await Beach.find({ 'name': { '$regex': `${term}`, '$options': 'i' } }, 'name').exec();
        res.json({
            results: beaches
        });
    }
})

router.post('/add', async function (req, res) {
    const newBeach = new Beach({
        name: req.body.name,
        description: req.body.description,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        images: req.body.images,
    })
    await newBeach.save(function (err, newAdd) {
        if (err) {
            console.log(err);
            return res.status(400).json({ success: false, msg: err });
        } else {
            res.status(201).json({ success: true, createdAt: (req.get('host') + req.baseUrl + '/' + newAdd._id) });
        }


    });
});

router.delete('/delete/:id', function (req, res) {

    Beach.findOneAndDelete({ _id: req.params.id })
        .exec(function (err, ad) {
            if (err) {
                res.status(400).json({ success: false, msg: 'Cannot remove item' });
            }
            else if (!ad) {
                res.status(404).json({ success: false, msg: 'Beach not found' });
            } else {
                res.json({ success: true, msg: `Beach with ID ${req.params.id} deleted` });
            }

        });
});

module.exports = router;