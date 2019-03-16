const cron = require('node-cron');
const cache = require('./../data/cache');
const { getSyllabus } = require('./../helpers/syllabusHelper');

async function update() {
  try {
    Object.entries(await getSyllabus()).forEach(([key, value]) => {
      cache.set(key, value);
    });
  } catch (err) {
    console.error(err);
  }
}

async function get(field) {
  const result = cache.get(field);

  if (!result) {
    await update();
  }

  return cache.get(field);
}

cron.schedule('5 5 * * 7', update);

module.exports = {
  get,
};
