const cron = require('node-cron');
const path = require('path');
const fs = require('fs');

const cache = require('./../data/cache');
const { getSyllabus } = require('./../helpers/syllabusHelper');

async function setValuesFromObjectInCache(obj) {
  Object.entries(obj).forEach(([key, value]) => {
    cache.set(key, value);
  });
}

async function update() {
  try {
    const data = await getSyllabus();
    setValuesFromObjectInCache(data);
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
setValuesFromObjectInCache(JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/staticData.json')) || {}));

module.exports = {
  get,
};
