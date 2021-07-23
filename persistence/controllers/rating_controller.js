var express = require("express");
var router = express.Router();
var Rating = require("../models/Rating.js");
var Beach = require("../models/Beach.js");
var User = require("../models/User.js");

const logger = require("../helpers/loggers.js");

router.post("/", async function (req, res) {
  var rating = await Rating.findOne({
    beachId: req.body.beachId,
    userId: req.body.userId,
  }).exec();
  if (rating != null) {
    logger.error(
      `User ${req.body.userId} has already rated beach ${req.body.beachId}`
    );
    return res
      .status(400)
      .json({ success: false, msg: "You have already rated !" });
  }

  var user;

  try {
    user = await User.findById(req.body.userId);
    console.log(beach);
  } catch (e) {
    logger.error(`No user found with ID ${req.body.userId}`);
    return res.status(400).json({
      success: false,
      msg: `No user found with ID ${req.body.userId}`,
    });
  }

  var beach;

  try {
    beach = await Beach.findById(req.body.beachId);
    console.log(beach);
  } catch (e) {
    logger.error(`No beach found with ID ${req.body.beachId}`);
    return res.status(400).json({
      success: false,
      msg: `No beach found with ID ${req.body.beachId}`,
    });
  }

  const newRating = new Rating({
    beachId: req.body.beachId,
    rating: req.body.rating,
    userId: req.body.userId,
  });

  await newRating.save(function (err, newAdd) {
    if (err) {
      logger.error(`Something went wrong ! ${err}`);
      return res.status(400).json({ success: false, msg: err });
    } else {
      logger.success(`Beach with ID ${req.body.beachId} has been rated`);
      res.status(201).json({
        success: true,
        createdAt: req.get("host") + req.baseUrl + "/" + newAdd._id,
      });
    }
  });
});

router.post("/search", async function (req, res) {
  var beachId = req.body.beachId;
  // Restricts search term's length to avoid unnecessary document reads.
  if (beachId.length <= 4) {
    logger.error(`At least 4 characters are needed to perform search`);
    res.status(404).json({
      success: false,
      msg: "At least 4 characters are needed to perform search",
    });
  } else {
    var ratings = await Rating.find({ beachId: beachId }).exec();
    logger.info(`Beach has ${ratings.length} ratings.`);
    res.json({
      results: ratings,
    });
  }
});

module.exports = router;
