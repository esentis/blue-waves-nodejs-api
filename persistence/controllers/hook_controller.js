var express = require("express");
var crypto = require("crypto");
var cmd = require("node-cmd");
var router = express.Router();

const verifySignature = (req, res, next) => {
  const payload = JSON.stringify(req.body);
  const hmac = crypto.createHmac("sha1", process.env.GITHUB_SECRET);
  const digest = "sha1=" + hmac.update(payload).digest("hex");
  const checksum = req.headers["x-hub-signature"];

  if (!checksum || !digest || checksum !== digest) {
    return res.status(403).send("auth failed");
  }

  return next();
};

// Github webhook listener
router.post("/", verifySignature, (req, res) => {
  if (req.headers["x-github-event"] == "push") {
    cmd.get("bash git.sh", (err, data) => {
      if (err) return console.log(err);
      console.log(data);
      return res.status(200).send(data);
    });
  } else if (req.headers["x-github-event"] == "ping") {
    return res.status(200).send("PONG");
  } else {
    return res.status(200).send("Unsuported Github event. Nothing done.");
  }
});

module.exports = router;
