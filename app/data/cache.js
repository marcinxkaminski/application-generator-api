const cache = {
  departments: [],
  cycles: [],
  types: [],
  faculties: [],
  years: [],
  subjects: [],
  prices: {},
  deans: {},
};

async function set(key, value) {
  if (key && value) {
    cache[key] = value;
  }
};

function get(key) { return cache[key] };

module.exports = {
  get,
  set,
};
