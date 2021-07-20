var express = require("express");
var crypto = require("crypto");
var cmd = require("node-cmd");
var beaches = require("./persistence/controllers/beach_controller.js");
var ratings = require("./persistence/controllers/rating_controller.js");
var favorites = require("./persistence/controllers/favorite_controller.js");
var users = require("./persistence/controllers/user_controller.js");

require("./db_connection.js");

const app = express();

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
app.post("/git", verifySignature, (req, res) => {
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

// create application/json parser
app.use(express.json());

app.use("/beaches", beaches);
app.use("/ratings", ratings);
app.use("/favorites", favorites);
app.use("/users", users);

app.listen(3000, function () {
  console.log("Express server listening on port ", 3000);
});

module.exports = app;
