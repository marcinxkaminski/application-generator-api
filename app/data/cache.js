const cache = {
  faculties: [],
  years: [],
  types: [],
  levels: [],
  programmes: {},
  modules: {},
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
