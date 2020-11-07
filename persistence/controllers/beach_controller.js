var express = require('express');
var router = express.Router();
var Beach = require('../models/Beach.js');

const logger = require('../helpers/loggers.js');

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
            logger.error(`Page ${req.query.page} doesn't exist.`);
            res.status(404).json({ success: false, msg: `Page ${req.query.page} doesn't exist.` }).end();
        } else {
            const beaches = await Beach.find().limit(limit * 1).skip((page - 1) * limit).exec();
            var beachesDto = [];
            beaches.forEach(beach => {
                beachesDto.push(beach.toDto());
            })
            logger.info(`Total beaches found ${count}. Showing page ${page}.`);
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
        logger.info(`Total beaches found ${count}. Showing page ${page}.`);
        res.json({
            beaches: beachesDto,
            totalPages: totalpages,
            currentPage: page
        });
    }
});

router.get('/all', async function (req, res) {
    logger.info('Getting all beaches...');
    const beaches = await Beach.find().exec();
    logger.info(`Found ${beaches.length} beaches!`);
    res.json({
        beaches: beaches,
    });
});

router.post('/search', async function (req, res) {
    var term = escapeRegex(req.body.term);
    // Restricts search term's length to avoid unnecessary document reads.
    if (term.length < 4) {
        logger.warn('At least 4 characters are needed to perform search');
        res.status(404).json({ success: false, msg: "At least 4 characters are needed to perform search" });
    } else {
        logger.info(`Searching for "${term}" in beaches`);
        // Performs a LIKE query with $regex. The 'i' at options makes it case insensitive
        var beaches = await Beach.find({ 'name': { '$regex': `${term}`, '$options': 'i' } }, 'name').exec();
        logger.info(`Found ${beaches.length} results.`);
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
            logger.error(`Cannot add beach ! ${err}`);
            return res.status(400).json({ success: false, msg: err });
        } else {
            logger.success(`Beach has been created at ${req.get('host') + req.baseUrl + '/' + newAdd._id}`);
            res.status(201).json({ success: true, createdAt: (req.get('host') + req.baseUrl + '/' + newAdd._id) });
        }


    });
});

router.delete('/delete/:id', function (req, res) {
    logger.info(`Trying to delete beach with ID ${req.params.id}`);
    Beach.findOneAndDelete({ _id: req.params.id })
        .exec(function (err, ad) {
            if (err) {
                logger.error(`Cannot remove item ! ${err}`);
                res.status(400).json({ success: false, msg: 'Cannot remove item' });
            }
            else if (!ad) {
                logger.error(`No beach found with ID ${req.params.id}`);
                res.status(404).json({ success: false, msg: 'Beach not found' });
            } else {
                logger.success('Beach deleted');
                res.json({ success: true, msg: `Beach deleted` });
            }

        });
});

module.exports = router;