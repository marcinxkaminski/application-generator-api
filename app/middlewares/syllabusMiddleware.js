const cache = require('../helpers/cacheManager');
const helper = require('../helpers/syllabusHelper');

const departments = (req, res, next) => {
  // TODO: implement getting from cache or if empty from syllabus

};

const cycles = (req, res, next) => {
  // TODO: implement getting from cache or if empty from syllabus
};

const types = (req, res, next) => {
  // TODO: implement getting from cache or if empty from syllabus
};

const faculties = async (req, res, next) => {
  res.json(await helper.getSyllabus());
};

const years = (req, res, next) => {
  // TODO: implement getting from cache or if empty from syllabus
};

const subjects = (req, res, next) => {
  // TODO: implement getting from cache or if empty from syllabus
};

const prices = (req, res, next) => {
  // TODO: implement getting from cache or if empty from syllabus
};

module.exports = {
  departments,
  cycles,
  types,
  faculties,
  years,
  subjects,
  prices,
};
