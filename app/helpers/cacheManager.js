const cron = require('node-cron');
const path = require('path');
const fs = require('fs');

const cache = require('./../data/cache');
const { getSyllabus } = require('./../helpers/syllabusHelper');

async function setValuesFromObjectInCache(obj) {
  const setPromises = [];

  Object.entries(data).forEach(([key, value]) => {
    setPromises.push(() => { cache.set(key, value); });
  });

  Promise.all(setPromises);
}

async function update() {
  try {
    const data = await getSyllabus();
    if(data){
      setValuesFromObjectInCache();
    }
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
_setValuesFromObjectInCache(JSON.parse(fs.readFileSync(__dirname + '../data/staticData.json') || {}));

module.exports = {
  get,
};
