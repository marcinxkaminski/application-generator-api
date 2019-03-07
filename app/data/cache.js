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

const set = (key, value) => {
  if (key && value) {
    cache[key] = value;
  }
};

const get = key => cache[key];

module.exports = {
  get,
  set,
};
