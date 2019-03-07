const cache = require('./../data/cache');
const SyllabusHelper = require('./../helpers/syllabusHelper');

const get = (key) => {
  const result = cache.get(key);
  // TODO: handle if result is not empty then return, else download data from syllabus and set it
  SyllabusHelper(result);
};

const update = () => {
  // TODO: periodically run function and update the cache
  // every week at 3:33
};

module.exports = {
  get,
  update,
};
