const checkApiKey = (string) => {
  return string == process.env.API_KEY;
};
// Exporting Function
module.exports = checkApiKey;
