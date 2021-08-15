var express = require("express");
var router = express.Router();
var Beach = require("../models/Beach.js");
var Country = require("../models/Country.js");
var Image = require("../models/Image.js");
var User = require("../models/User.js");

const logger = require("../helpers/loggers.js");
const ObjectId = require("mongodb").ObjectID;
const escapeRegex = require("../helpers/escape_regex.js");
const checkApiKey = require("../helpers/check_apiKey.js");

router.get("/", async function (req, res) {
  if (!checkApiKey(req.headers.authorization)) {
    logger.error("Unauthorized.");
    return res.status(401).json({ success: false, message: "Unauthorized." });
  }

  // Destructures page and limit and set default values if not provided.
  var { page = 1, limit = 10 } = req.query;

  // Flutter for some reason tranlates null as  ''
  if (req.query.limit == "") {
    limit = 10;
  }
  if (req.query.page == "") {
    page = 1;
  }
  // Gets total documents in the Beaches collection.
  const count = await Beach.countDocuments();
  var totalpages = Math.ceil(count / limit);

  // If page provided doesn't exist.
  if (req.query.page != undefined) {
    if (req.query.page > totalpages) {
      logger.error(`Page ${req.query.page} doesn't exist.`);
      res
        .status(404)
        .json({ success: false, msg: `Page ${req.query.page} doesn't exist.` })
        .end();
    } else {
      const beaches = await Beach.find()
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select("-__v")
        .exec();

      logger.info(`Total beaches found ${count}. Showing page ${page}.`);
      res.json({
        beaches: beaches,
        totalPages: totalpages,
        currentPage: page,
      });
    }
    // If page exists, we limit the results and show the page accordingly.
  } else {
    const beaches = await Beach.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select("-__v")
      .exec();

    logger.info(`Total beaches found ${count}. Showing page ${page}.`);
    res.json({
      beaches: beaches,
      totalPages: totalpages,
      currentPage: page,
    });
  }
});

router.get("/:id", async function (req, res) {
  if (!checkApiKey(req.headers.authorization)) {
    logger.error("Unauthorized.");
    return res.status(401).json({ success: false, message: "Unauthorized." });
  }
  try {
    var beach = await Beach.findById(req.params.id).select("-__v");
  } catch (e) {
    logger.e(e);
    return res.status(404).json({
      success: false,
      message: "Beach not found",
    });
  }

  if (beach == null) {
    logger.error("Beach not found.");
    return res.status(404).json({ success: false, message: "Beach not found" });
  }
  logger.info(`Beach found ${beach.name}`);
  return res.status(200).json({ success: true, results: beach });
});

router.post("/search", async function (req, res) {
  if (!checkApiKey(req.headers.authorization)) {
    logger.error("Unauthorized.");
    return res.status(401).json({ success: false, message: "Unauthorized." });
  }
  if (req.body.term == null) {
    logger.warn("At least 4 characters are needed to perform search");
    return res.status(400).json({
      success: false,
      msg: "At least 4 characters are needed to perform search",
    });
  }
  var term = escapeRegex(req.body.term);
  // Restricts search term's length to avoid unnecessary document reads.
  if (term.length < 4) {
    logger.warn("At least 4 characters are needed to perform search");
    res.status(400).json({
      success: false,
      msg: "At least 4 characters are needed to perform search",
    });
  } else {
    logger.info(`Searching for "${term}" in beaches`);
    // Performs a LIKE query with $regex. The 'i' at options makes it case insensitive
    var beaches = await Beach.find(
      { name: { $regex: `${term}`, $options: "i" } },
      "name"
    ).exec();
    logger.info(`Found ${beaches.length} results.`);
    res.json({
      results: beaches,
    });
  }
});

router.post("/", async function (req, res) {
  if (!checkApiKey(req.headers.authorization)) {
    logger.error("Unauthorized.");
    return res.status(401).json({ success: false, message: "Unauthorized." });
  }
  const newBeach = new Beach({
    name_el: req.body.name_el,
    name_en: req.body.name_en,
    description_el: req.body.description_el,
    description_en: req.body.description_en,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    countryId: req.body.countryId,
  });

  try {
    var country = await Country.findById(req.body.countryId);
  } catch (e) {
    logger.error(e.message);
    return res.status(400).json({
      success: false,
      message: `No country found with ID ${req.body.countryId}`,
    });
  }
  if (country == null) {
    logger.error("Country not found.");
    return res.status(400).json({
      success: false,
      message: "Country not found.",
    });
  }
  var images = req.body.images;

  await newBeach.save(async function (err, newAdd) {
    if (err) {
      logger.error(`Cannot add beach ! ${err}`);
      return res.status(400).json({ success: false, msg: err });
    } else {
      logger.success(
        `Beach has been created at ${
          req.get("host") + req.baseUrl + "/" + newAdd._id
        }`
      );

      res.status(201).json({
        success: true,
        createdAt: req.get("host") + req.baseUrl + "/" + newAdd._id,
      });
    }
    if (images != null) {
      for (var i = 0; i < images.length; i++) {
        var newImage = Image({
          url: images[i],
          beachId: newAdd._id,
        });
        await newImage.save(function (err, newImage) {
          if (err) {
            logger.error(`Image failed to save ${err.message}`);
          } else {
            logger.success(`Image added for beach ${newAdd._id}`);
          }
        });
      }
    }
  });
});

router.delete("/:id", async function (req, res) {
  if (!checkApiKey(req.headers.authorization)) {
    logger.error("Unauthorized.");
    return res.status(401).json({ success: false, message: "Unauthorized." });
  }
  if (req.body.userId == null || req.body.userId == "") {
    return res
      .status(400)
      .json({ success: false, message: "User ID is required" });
  }

  await User.findById({ _id: req.body.userId }).exec(async function (
    err,
    user
  ) {
    if (err) {
      logger.error(`Something went wrong ! ${err}`);
      res.status(400).json({ success: false, msg: err });
    } else if (!user) {
      logger.error(`${ObjectId(req.body.userId)} not found in database.`);
      res
        .status(404)
        .json({ success: false, msg: "User not found in database." });
    } else {
      if (user.role == "admin") {
        logger.warn("User is admin proceeding deletion");
        logger.info(`Trying to delete beach with ID ${req.params.id}`);
        await Beach.findOneAndDelete({ _id: req.params.id }).exec(function (
          err,
          ad
        ) {
          if (err) {
            logger.error(`Cannot remove item ! ${err}`);
            res.status(400).json({ success: false, msg: "Cannot remove item" });
          } else if (!ad) {
            logger.error(`No beach found with ID ${req.params.id}`);
            res.status(404).json({ success: false, msg: "Beach not found" });
          } else {
            logger.success("Beach deleted");
            res.json({ success: true, msg: `Beach deleted` });
          }
        });
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }
    }
  });
});

/// This endpoint may serve for future field aditions
router.post("/set", async function (req, res) {
  // await Beach.updateMany(
  //   {},
  //   {
  //     $set: {
  //       name_el: "",
  //       name_en: "",
  //       description_el: "",
  //       description_en: "",
  //     },
  //   }
  // );
  return res.status(200).json({ message: "Fields setted" });
});
/// This endpoint may serve for future field deletions
router.post("/unset", async function (req, res) {
  // await Beach.updateMany(
  //   {},
  //   {
  //     $unset: {
  //       name: 1,
  //     },
  //   }
  // );
  return res.status(200).json({ message: "Fields unsetted" });
});

module.exports = router;
