const cache = require('./../helpers/cacheManager');

function departments(req, res) {
  // TODO: implement getting from cache
  try {
    return res.status(200).send();
  } catch (err) {
    return res.status(500).send();
  }
}

function cycles(req, res) {
  // TODO: implement getting from cache or if empty from syllabus
  try {
    return res.status(200).send();
  } catch (err) {
    return res.status(500).send();
  }
}

function types(req, res) {
  // TODO: implement getting from cache or if empty from syllabus
  try {
    return res.status(200).send();
  } catch (err) {
    return res.status(500).send();
  }
}

function faculties(req, res) {
  // TODO: implement getting from cache or if empty from syllabus
  try {
    return res.status(200).send();
  } catch (err) {
    return res.status(500).send();
  }
}

function years(req, res) {
  // TODO: implement getting from cache or if empty from syllabus
  try {
    return res.status(200).send();
  } catch (err) {
    return res.status(500).send();
  }
}

function subjects(req, res) {
  // TODO: implement getting from cache or if empty from syllabus
  try {
    return res.status(200).send();
  } catch (err) {
    return res.status(500).send();
  }
}

function prices(req, res) {
  // TODO: implement getting from cache or if empty from syllabus
  try {
    return res.status(200).send();
  } catch (err) {
    return res.status(500).send();
  }
}

module.exports = {
  departments,
  cycles,
  types,
  faculties,
  years,
  subjects,
  prices,
};
