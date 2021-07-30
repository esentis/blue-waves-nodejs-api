var express = require("express");
var router = express.Router();
var Favorite = require("../models/Favorite.js");
var Beach = require("../models/Beach.js");
var User = require("../models/User.js");

const logger = require("../helpers/loggers.js");
const checkApiKey = require("../helpers/check_apiKey.js");

// Adds a beach to favorites
router.post("/", async function (req, res) {
  if (!checkApiKey(req.headers.authorization)) {
    logger.error("Unauthorized.");
    return res.status(401).json({ success: false, message: "Unauthorized." });
  }
  var favorite = await Favorite.findOne({
    beachId: req.body.beachId,
    userId: req.body.userId,
  }).exec();
  if (favorite != null) {
    await Favorite.deleteOne({
      beachId: req.body.beachId,
      userId: req.body.userId,
    }).exec(function (err, favorites) {
      if (err) {
        logger.error(`Something went wrong ! ${err}`);
      } else if (!favorites) {
        logger.error(`User has no favorites.`);
      } else {
        logger.warn(`Beach has been removed from favorites list.`);
        return res.status(204).json({
          success: false,
          msg: "Beach has been removed from favorites.",
        });
      }
    });
  } else {
    var user;

    try {
      user = await User.findOne({ id: req.body.userId });
    } catch (e) {
      logger.error(`No user found with ID ${req.body.userId}`);
      return res.status(400).json({
        success: false,
        msg: `No user found with ID ${req.body.userId}`,
      });
    }

    try {
      beach = await Beach.findById(req.body.beachId);
    } catch (e) {
      logger.error(`No beach found with ID ${req.body.beachId}`);
      return res.status(400).json({
        success: false,
        msg: `No beach found with ID ${req.body.beachId}`,
      });
    }

    const newFavorite = new Favorite({
      beachId: req.body.beachId,
      userId: req.body.userId,
    });

    await newFavorite.save(function (err, newAdd) {
      if (err) {
        logger.error(`Something went wrong ! ${err}`);
        return res.status(400).json({ success: false, msg: err });
      } else {
        logger.success(`Beach with ID ${req.body.beachId} has been favorited`);
        res.status(201).json({
          success: true,
          createdAt: req.get("host") + req.baseUrl + "/" + newAdd._id,
        });
      }
    });
  }
});

router.delete("/", async function (req, res) {
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

  await Favorite.deleteOne({ beachId: beachId, userId: userId }).exec(function (
    err,
    status
  ) {
    if (status["deletedCount"] == 0) {
      return res.status(400).json({ message: "Favorite not deleted" });
    } else {
      return res.status(204);
    }
  });
});

// Checks if beach is favorited  by the user
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
  var favorites = await Favorite.find({
    userId: userId,
    beachId: beachId,
  }).exec();
  logger.warn(
    `${
      favorites.length == 0
        ? "Beach is not favorited by the user."
        : "Beach is favorited."
    }`
  );
  res.json({
    results: favorites.length > 0,
  });
});

// Returns all user's personal favorite beaches
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
  var favorites = await Favorite.find({
    userId: userId,
    beachId: beachId,
  }).exec();
  logger.warn(
    `${
      favorites.length == 0
        ? "Beach is not favorited by the user."
        : "Beach is favorited."
    }`
  );
  res.json({
    results: favorites,
  });
});

module.exports = router;
