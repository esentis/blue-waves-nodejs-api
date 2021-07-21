var express = require("express");
var router = express.Router();
var Country = require("../models/Country.js");
const escapeRegex = require("../helpers/escape_regex.js");

const logger = require("../helpers/loggers.js");

router.post("/add", async function (req, res) {
  var country = await Country.findOne({
    name: req.body.name,
  }).exec();
  if (country != null) {
    logger.warn(`Country already exists.`);
    return res.status(400).json({
      success: false,
      msg: "Country already exists.",
    });
  } else {
    const newCountry = new Country({
      name: req.body.name,
      iso: req.body.iso,
      currency: req.body.currency,
      description: req.body.description,
    });

    await newCountry.save(function (err, newAdd) {
      if (err) {
        logger.error(`Something went wrong ! ${err}`);
        return res.status(400).json({ success: false, msg: err });
      } else {
        logger.success(`Continent successfully added.`);
        res.status(201).json({
          success: true,
          createdAt: req.get("host") + req.baseUrl + "/" + newAdd._id,
        });
      }
    });
  }
});

router.get("/:id", async function (req, res) {
  var countryId = req.params.id;
  try {
    var country = await Country.findById(req.params.id);
    return res.status(200).json(country);
  } catch (e) {
    logger.error(e);
    return res.status(400).json({
      success: false,
      message: `No country found with ID ${countryId}.`,
    });
  }
});

// Searches for a specific country
router.post("/search", async function (req, res) {
  var term = escapeRegex(req.body.term);
  // Restricts search term's length to avoid unnecessary document reads.
  if (term.length < 4) {
    logger.warn("At least 4 characters are needed to perform search");
    res.status(404).json({
      success: false,
      msg: "At least 4 characters are needed to perform search",
    });
  } else {
    logger.info(`Searching for "${term}" in beaches`);
    // Performs a LIKE query with $regex. The 'i' at options makes it case insensitive
    var countries = await Country.find({
      name: { $regex: `${term}`, $options: "i" },
    })
      // Exclude __v field
      .select("-__v")
      .exec();
    logger.info(`Found ${countries.length} results.`);
    res.json({
      results: countries,
    });
  }
});

module.exports = router;
