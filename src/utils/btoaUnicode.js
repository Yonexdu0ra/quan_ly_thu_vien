function btoaUnicode(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

module.exports = btoaUnicode;