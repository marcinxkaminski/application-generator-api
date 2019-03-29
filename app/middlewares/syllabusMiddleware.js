const cache = require('../helpers/cacheManager');

function respond(res, result) {
  try {
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
}

async function faculties(req, res) {
  return respond(res, await cache.get('faculties'));
}

async function years(req, res) {
  respond(res, await cache.get('years'));
}

async function types(req, res) {
  respond(res, await cache.get('types'));
}

async function levels(req, res) {
  respond(res, await cache.get('levels'));
}

async function fields(req, res) {
  respond(res, await cache.get('programmes', req.query.faculty, req.query.year, req.query.type, req.query.level));
}

async function mods(req, res) {
  respond(res, await cache.get('programmes', req.query.faculty, req.query.year, req.query.type, req.query.level, req.query.field, 'modules'));
}

async function mod(req, res) {
  respond(res, await cache.get('programmes', req.query.faculty, req.query.year, req.query.type, req.query.level, req.query.field, 'modules', req.params.module));
}

async function test(req, res) {
  respond(res, await cache.get());
}

module.exports = {
  faculties,
  years,
  types,
  levels,
  fields,
  mods,
  mod,
  test,
};
