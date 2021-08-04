var express = require("express");
var router = express.Router();
var User = require("../models/User.js");
var Rating = require("../models/Rating.js");
var Favorite = require("../models/Favorite.js");

const logger = require("../helpers/loggers.js");
const checkApiKey = require("../helpers/check_apiKey.js");
const ObjectId = require("mongodb").ObjectID;

// Create a new user
router.post("/", async function (req, res) {
  if (!checkApiKey(req.headers.authorization)) {
    logger.error("Unauthorized.");
    return res.status(401).json({ success: false, message: "Unauthorized." });
  }
  const newUser = new User({
    username: req.body.username,
    karma: 0,
    role: "user",
    id: req.body.id,
    joinDate: Date.now(),
  });

  await User.findOne(
    { username: req.body.username },
    async function (err, user) {
      if (err) {
        logger.error(`Something went wrong ! ${err}`);
        return res.status(400).json({ success: false, msg: err });
      } else {
        if (user != null) {
          logger.error("Username already exists");
          return res
            .status(400)
            .json({ success: false, msg: "Username already exists!" });
        } else {
          await newUser.save(function (err, newAdd) {
            if (err) {
              logger.error(`Something went wrong ! ${err}`);
              return res.status(400).json({ success: false, msg: err });
            } else {
              logger.success(
                `New user created at ${
                  req.get("host") + req.baseUrl + "/" + newAdd._id
                }`
              );
              res.status(201).json({
                success: true,
                createdAt: req.get("host") + req.baseUrl + "/" + newAdd._id,
              });
            }
          });
        }
      }
    }
  );
});

router.post("/check", async function (req, res) {
  if (!checkApiKey(req.headers.authorization)) {
    logger.error("Unauthorized.");
    return res.status(401).json({ success: false, message: "Unauthorized." });
  }

  if (req.body.id == null || req.body.id.length == 0) {
    logger.error("Missing required parameters");
    return res
      .status(400)
      .json({ success: false, message: "Missing required parameters" });
  }

  var user = await User.findOne({ id: req.body.id });

  console.log(user);

  if (user == null) {
    logger.error("User not found");
    return res.status(404).json({ success: false, message: "User not found" });
  }

  return res
    .status(200)
    .json({ success: true, message: "User found in database" });
});

// Delete a user
router.delete("/", async function (req, res) {
  if (!checkApiKey(req.headers.authorization)) {
    logger.error("Unauthorized.");
    return res.status(401).json({ success: false, message: "Unauthorized." });
  }
  logger.info(`Request to delete user with ID: ${req.body.id}`);
  await Rating.deleteMany({ userId: req.body.id }).exec(function (
    err,
    ratings
  ) {
    if (err) {
      logger.error(`Something went wrong ! ${err}`);
    } else if (!ratings) {
      logger.error(`User has no ratings.`);
    } else {
      logger.warn(`${ratings.deletedCount} ratings deleted.`);
    }
  });

  await Favorite.deleteMany({ userId: req.body.id }).exec(function (
    err,
    favorites
  ) {
    if (err) {
      logger.error(`Something went wrong ! ${err}`);
    } else if (!favorites) {
      logger.error(`User has no favorites.`);
    } else {
      logger.warn(`${favorites.deletedCount} favorites deleted.`);
    }
  });

  await User.deleteOne({ _id: req.body.id }).exec(function (err, user) {
    if (err) {
      logger.error(`Something went wrong ! ${err}`);
      res.status(400).json({ success: false, msg: err });
    } else if (!user) {
      logger.error(`${ObjectId(req.body.id)} not found in database.`);
      res
        .status(404)
        .json({ success: false, msg: "User not found in database." });
    } else {
      logger.success(`User has been successfully deleted.`);
      res.json({ success: true, msg: "User successfuly deleted." });
    }
  });
});

module.exports = router;
