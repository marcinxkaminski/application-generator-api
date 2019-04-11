const cache = {
  faculties: [],
  years: [],
  types: [],
  levels: [],
  programmes: {},
};

async function set(key, value) {
  if (key && value) {
    cache[key] = value;
  }
}

function get(key) { return key ? cache[key] : cache; }

module.exports = {
  get,
  set,
};
