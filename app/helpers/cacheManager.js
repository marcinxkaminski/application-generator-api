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
  // eslint-disable-next-line no-use-before-define
  const programmes = await get(key);
  // eslint-disable-next-line no-use-before-define
  const slug = await get('programmes', faculty, year, type, level, field);
  const modules = await getModulesFromSyllabus(faculty, year, slug, type, level, field);
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
  try {
    const result = getParameterFromObject(key, params) || (await updateAndGet(key, ...params));
    return result;
  } catch (err) {
    console.error(err);
  }
  return null;
}

cron.schedule('5 5 * * 7', update);
setValuesFromObjectInCache(JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/staticData.json')) || {}));
(async () => {
  await update();
  console.log('Ready');
})();

module.exports = {
  get,
};
