const cron = require('node-cron');
const path = require('path');
const fs = require('fs');
const cache = require('./../data/cache');
const { getProgrammesFromSyllabus, getModulesFromSyllabus } = require('./../helpers/syllabusHelper');

async function setValuesFromObjectInCache(obj) {
  const setPromises = [];

  Object.entries(obj).forEach(([key, value]) => {
    setPromises.push((cache.set(key, value)));
  });

  Promise.all(setPromises);
}

async function update(key, params) {
  try {
    let data;
    if (params !== undefined) {
      if (params.length >= 6) {
        const [faculty, year, type, level, field] = params;
        const programmes = cache.get('programmes');
        const slug = cache.get('programmes')[faculty][year][type][level][field];
        programmes[faculty][year][type][level][field] = await getModulesFromSyllabus(faculty, year, slug);
        data = { programmes };
      }
    } else {
      data = await getProgrammesFromSyllabus(cache.get('faculties'), cache.get('years'));
    }
    setValuesFromObjectInCache(data);
  } catch (err) {
    console.error(err);
  }
}

function getParameterFromObject(key, params = []) {
  let result = cache.get(key);

  params.forEach((param) => {
    result = result !== undefined ? result[param] : undefined;
  });
  return result;
}

async function updateAndGet(key, params) {
  try {
    await update(key, params);
    return getParameterFromObject(key, params);
  } catch (err) {
    console.error(err);
  }
  return null;
}

async function get(key, ...params) {
  let result = getParameterFromObject(key, params);
  result = result !== undefined ? result : await updateAndGet(key, params);
  return result;
}

cron.schedule('5 5 * * 7', update);
setValuesFromObjectInCache(JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/staticData.json')) || {}));

async function continuousUpdater(){
  await update();
  console.log('ready');
}

continuousUpdater();

module.exports = {
  get,
};
