const cache = require('../helpers/cacheManager');
const helper = require('../helpers/syllabusHelper');

const faculties = (req, res, next) => {
  // TODO: implement getting from cache or if empty from syllabus

};

const cycles = (req, res, next) => {
  // TODO: implement getting from cache or if empty from syllabus
};

const types = (req, res, next) => {
  // TODO: implement getting from cache or if empty from syllabus
};

const programmes = async (req, res, next) => {
  res.json(await helper.getProgrammesFromSyllabus());
  // TODO: implement getting from cache if not empty
};

const years = (req, res, next) => {
  // TODO: implement getting from cache or if empty from syllabus
};

const subjects = async (req, res, next) => {
  res.json(await helper.getModulesFromSyllabus(req.query.faculty, req.query.year, req.query.slug));
  // TODO: implement getting from cache if not empty
};

const prices = (req, res, next) => {
  // TODO: implement getting from cache or if empty from syllabus
};

module.exports = {
  faculties,
  cycles,
  types,
  programmes,
  years,
  subjects,
  prices,
};
