// Regex function for search functionality
const escapeRegex = (string) => {
  return string.replace(/[-[\]{}()*+?,\\^$|#]/g, "");
};
// Exporting Function
module.exports = escapeRegex;
