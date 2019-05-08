function capitalize(str) {
  return str.toLowerCase().replace(/(?:^|\s)\S/g, a => a.toUpperCase());
}

module.exports = { capitalize };
