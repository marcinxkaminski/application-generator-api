const cron = require('node-cron');
const path = require('path');
const fs = require('fs');
const cache = require('./../data/cache');
const { getProgrammesFromSyllabus, getModulesFromSyllabus } = require('./../helpers/syllabusHelper');

async function setValuesFromObjectInCache(obj) {
  const setPromises = [];

  Object.entries(obj).forEach(([key, value]) => {
    setPromises.push(cache.set(key, value));
  });

  Promise.all(setPromises);
}

async function updateModules(key, ...[faculty, year, type, level, field]) {
  const programmes = await get(key);
  const slug = await get('programmes', faculty, year, type, level, field);
  const modules = await getModulesFromSyllabus(faculty, year, slug);
  Promise.all([programmes, slug, modules]);
  programmes[faculty][year][type][level][field] = modules;
  setValuesFromObjectInCache({ programmes });
}

async function updateProgrammes() {
  const data = await getProgrammesFromSyllabus(cache.get('faculties'), cache.get('years'));
  setValuesFromObjectInCache(data);
}

async function update(key, ...[faculty, year, type, level, field, mods]) {
  try {
    if (mods) {
      await updateModules(key, faculty, year, type, level, field);
    } else {
      await updateProgrammes();
    }
  } catch (err) {
    console.error(err);
  }
}

function getParameterFromObject(key, params = []) {
  let result = cache.get(key);

  params.forEach((param) => {
    result = result ? result[param] : result;
  });
  return result;
}

async function updateAndGet(key, ...params) {
  try {
    await update(key, ...params);
    return getParameterFromObject(key, params);
  } catch (err) {
    console.error(err);
  }
  return null;
}

async function get(key, ...params) {
  let result = getParameterFromObject(key, params);
  result = !result ? await updateAndGet(key, ...params) : result;
  return result;
}

cron.schedule('5 5 * * 7', update);
setValuesFromObjectInCache(JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/staticData.json')) || {}));

async function initializeCache() {
  await update();
  console.log('ready');
}

initializeCache();

module.exports = {
  get,
};
