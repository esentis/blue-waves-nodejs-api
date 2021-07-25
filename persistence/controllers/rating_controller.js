var express = require("express");
var router = express.Router();
var Rating = require("../models/Rating.js");
var Beach = require("../models/Beach.js");
var User = require("../models/User.js");
var mongoose = require("mongoose");
const logger = require("../helpers/loggers.js");

const checkApiKey = require("../helpers/check_apiKey.js");

router.post("/", async function (req, res) {
  if (!checkApiKey(req.headers.authorization)) {
    logger.error("Unauthorized.");
    return res.status(401).json({ success: false, message: "Unauthorized." });
  }

  var user;

  try {
    user = await User.findById(req.body.userId);
  } catch (e) {
    logger.error(`No user found with ID ${req.body.userId}`);
    return res.status(400).json({
      success: false,
      msg: `No user found with ID ${req.body.userId}`,
    });
  }
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

  var beach;

  try {
    beach = await Beach.findById(req.body.beachId);

    if (beach.ratingCount == null) {
      beach.ratingCount = 1;
      beach.totalRatingSum = req.body.rating;
      beach.averageRating = req.body.rating;
    } else {
      beach.ratingCount++;
      beach.totalRatingSum += req.body.rating;
      beach.averageRating = beach.totalRatingSum / beach.ratingCount;
    }
  } catch (e) {
    logger.error(e.message);
    return res.status(400).json({
      success: false,
      msg: e.message,
    });
  }

  const newRating = new Rating({
    beachId: req.body.beachId,
    rating: req.body.rating,
    userId: req.body.userId,
    review: req.body.review,
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
  await beach.save();
});

// Checks if beach is rated  by the user
router.post("/check", async function (req, res) {
  if (!checkApiKey(req.headers.authorization)) {
    logger.error("Unauthorized.");
    return res.status(401).json({ success: false, message: "Unauthorized." });
  }
  var userId = req.body.userId;
  var beachId = req.body.beachId;
  if (userId == null || beachId == null) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }
  var ratings = await Rating.find({
    userId: userId,
    beachId: beachId,
  }).exec();
  logger.warn(
    `${
      ratings.length == 0
        ? "Beach is not rated by the user."
        : "Beach is rated."
    }`
  );
  res.json({
    results: ratings.length > 0,
  });
});

// Returns all user's personal rated beaches
router.post("/personal", async function (req, res) {
  if (!checkApiKey(req.headers.authorization)) {
    logger.error("Unauthorized.");
    return res.status(401).json({ success: false, message: "Unauthorized." });
  }

  var userId = req.body.userId;
  var beachId = req.body.beachId;

  if (userId == null || beachId == null) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }
  var ratings = await Rating.find({
    userId: userId,
    beachId: beachId,
  }).exec();
  logger.warn(
    `${
      ratings.length == 0
        ? "Beach is not favorited by the user."
        : "Beach is favorited."
    }`
  );
  res.json({
    results: ratings,
  });
});

module.exports = router;
