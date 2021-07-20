var winston = require("winston");

const myCustomLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    success: 2,
  },
};

winston.addColors({
  error: "red bold",
  warn: "yellow bold",
  info: "cyan bold",
  success: "green bold",
});

const logger = winston.createLogger({
  levels: myCustomLevels.levels,
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp({ format: "YYYY/MM/DD HH:mm:ss" }),
    winston.format.printf(
      (info) => `[${info.timestamp}] ${info.level}: ${info.message}`
    )
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logfile.log", level: "error" }),
  ],
});

module.exports = logger;
