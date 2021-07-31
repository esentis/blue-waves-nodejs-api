var express = require("express");
var router = express.Router();
var Image = require("../models/Image.js");
var Beach = require("../models/Beach.js");
const logger = require("../helpers/loggers.js");
const checkApiKey = require("../helpers/check_apiKey.js");
const validator = require("../helpers/validators.js");

router.post("/", async (req, res) => {
  if (!checkApiKey(req.headers.authorization)) {
    logger.error("Unauthorized.");
    return res.status(401).json({ success: false, message: "Unauthorized." });
  }
  if (!req.body.beachId || !req.body.url) {
    logger.error("Missing required parameters.");
    return res.status(400).json({
      success: false,
      message: "Missing required parameters Url or Beach Id",
    });
  }

  if (!validator.isUrl(req.body.url)) {
    logger.error("Not valid url format");
    return res.status(400).json({
      success: false,
      message: "Not valid url format",
    });
  }

  try {
    image = await Image.findOne({
      beachId: req.body.beachId,
      url: req.body.url,
    });
  } catch (e) {
    logger.error(`${e}`);
    return res.status(400).json({
      success: false,
      msg: e,
    });
  }

  if (image != null) {
    return res.status(400).json({
      success: false,
      msg: "Image with the specific URL already exists for the Beach.",
    });
  }

  try {
    beach = await Beach.findById(req.body.beachId);
  } catch (e) {
    logger.error(`No beach found with ID ${req.body.beachId} ${e}`);
    return res.status(400).json({
      success: false,
      msg: `No beach found with ID ${req.body.beachId}`,
    });
  }

  var newImage = new Image({
    url: req.body.url,
    beachId: req.body.beachId,
  });

  await newImage.save(function (err, newAdd) {
    if (err) {
      logger.error(`Something went wrong ! ${err}`);
      return res.status(400).json({ success: false, msg: err });
    } else {
      logger.success(`Image successfully added for beach ${req.body.beachId}`);
      res.status(201).json({
        success: true,
        createdAt: req.get("host") + req.baseUrl + "/" + newAdd._id,
      });
    }
  });
});

router.get("/:id", async (req, res) => {
  if (!checkApiKey(req.headers.authorization)) {
    logger.error("Unauthorized.");
    return res.status(401).json({ success: false, message: "Unauthorized." });
  }
  try {
    var image = await Image.findById(req.params.id).select("-__v");
  } catch (e) {
    logger.error(e);
    return res.status(404).json({
      success: false,
      message: "Image not found",
    });
  }

  if (image != null) {
    return res.status(200).json({
      success: true,
      results: image,
    });
  }
  return res.status(404).json({
    success: false,
    message: "Image not found",
  });
});

router.get("/beach/:beachId", async (req, res) => {
  if (!checkApiKey(req.headers.authorization)) {
    logger.error("Unauthorized.");
    return res.status(401).json({ success: false, message: "Unauthorized." });
  }
  console.log(req.params.beachId);
  var images = await Image.find({ beachId: req.params.beachId })
    .select("url")
    .select("-_id");

  logger.info(`Found ${images.length} images for ${req.params.beachId}`);
  return res.status(200).json({
    results: images,
  });
});
module.exports = router;
