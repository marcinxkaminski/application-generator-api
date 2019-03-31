const fetch = require('node-fetch');
const prices = require('./../data/staticPrices.json');
const textUtils = require('./../helpers/textUtils');

const MAX_FETCH_ATTEMPTS = 15;
const DEFAULT_PRICE = 0;
const SLUG_INDEX_IN_STUDY_PROGRAM_URL = 7;

function fetchSyllabus(url, method = 'GET') {
  const options = {
    method,
    mode: 'no-cors',
    cache: 'no-cache',
    credentials: 'include',
    timeout: 0,
    headers: {
      'Accept-Language': 'pl',
      Accept: 'application/vnd.syllabus.agh.edu.pl.v2+json',
      'Content-Type': 'application/json',
    },
  };
  return fetch(url, options);
}

async function attemptToFetchSyllabus(url, attemptsNumber = 1) {
  for (let i = 0; i <= attemptsNumber; ++i) {
    const res = await fetchSyllabus(url);

    if (res.status === 200) {
      return res.json();
    }
  }
}

async function fetchJsonFromSyllabus(url) {
  try {
    const res = await fetchSyllabus(url);
    return res.json();
  } catch (err) {
    console.error(err);
  }
  return {};
}

async function fetchProgrammesForYear(faculty, year) {
  try {
    const res = await attemptToFetchSyllabus(`https://syllabuskrk.agh.edu.pl/${year}/magnesite/api/faculties/${faculty}/study_plans`, MAX_FETCH_ATTEMPTS);
    return { year, year_programmes: res };
  } catch (err) {
    console.error(err);
  }

  return null;
}

async function fetchProgrammesForFaculty(faculty, years) {
  const yearsPromises = [];
  years.forEach((year) => {
    yearsPromises.push(fetchProgrammesForYear(faculty, year));
  });
  return { faculty, programmes: await Promise.all(yearsPromises) };
}

async function fetchProgrammes(faculties, years) {
  const programmesPromises = [];
  faculties.forEach((faculty) => {
    programmesPromises.push(fetchProgrammesForFaculty(faculty, years));
  });
  return Promise.all(programmesPromises);
}

function getProgramModulesUrl(faculty, year, slug) {
  return `http://syllabuskrk.agh.edu.pl/${year}/magnesite/api/faculties/${faculty}/study_plans/${slug}/modules`;
}

function parseModuleOwner(mod) {
  const moduleOwner = mod.module_owner;
  if (moduleOwner) {
    const title = moduleOwner.employee_title ? `${moduleOwner.employee_title} `.toLowerCase() : '';
    const name = textUtils.capitalize(moduleOwner.name);
    const surname = textUtils.capitalize(moduleOwner.surname);
    return `${title}${name} ${surname}`;
  }
  return null;
}

function parseModuleActivities(mod) {
  const activities = {};
  mod.module_activities.forEach((element) => {
    const activity = element.module_activity;
    activities[activity.type] = activity.classes_hours;
  });
  return activities;
}

function parseModules(modules, faculty) {
  const parsed = {};

  modules.syllabus.assignments.forEach((element) => {
    const mod = element.assignment.module;
    parsed[mod.name] = {
      code: element.assignment.module_code,
      ects: mod.ects_points,
      owner: parseModuleOwner(mod),
      activities: parseModuleActivities(mod),
      price: prices[mod.name] || prices[faculty] || DEFAULT_PRICE,
    };
  });
  return parsed;
}

function parseProgram(studyProgram) {
  const params = studyProgram.url.split('/');
  const slug = params[SLUG_INDEX_IN_STUDY_PROGRAM_URL];
  return slug;
}

function parseProgrammesForLevel(levelProgrammes) {
  const parsed = {};
  levelProgrammes.study_programmes.forEach((studyProgram) => {
    parsed[studyProgram.name] = parseProgram(studyProgram);
  });
  return parsed;
}

function parseProgrammesForStudyType(studyTypeProgrammes) {
  const parsed = {};
  studyTypeProgrammes.levels.forEach((levelProgrammes) => {
    parsed[levelProgrammes.code] = parseProgrammesForLevel(levelProgrammes);
  });
  return parsed;
}

function parseProgrammesForYear(yearProgrammes) {
  const parsed = {};
  yearProgrammes.year_programmes.syllabus.study_types.forEach((studyTypeProgrammes) => {
    parsed[studyTypeProgrammes.type] = parseProgrammesForStudyType(studyTypeProgrammes);
  });
  return parsed;
}

function parseProgrammesForFaculty(facultyProgrammes) {
  const parsed = {};
  facultyProgrammes.programmes.forEach((yearProgrammes) => {
    parsed[yearProgrammes.year] = parseProgrammesForYear(yearProgrammes);
  });
  return parsed;
}

function parseProgrammes(entries) {
  const programmes = {};
  entries.forEach((facultyProgrammes) => {
    programmes[facultyProgrammes.faculty] = parseProgrammesForFaculty(facultyProgrammes);
  });
  return programmes;
}

async function getProgrammesFromSyllabus(...[faculties, years]) {
  const entries = await fetchProgrammes(faculties, years);
  const parsedEntries = parseProgrammes(entries);
  return { programmes: parsedEntries };
}

async function getModulesFromSyllabus(faculty, year, slug) {
  try {
    const newUrl = getProgramModulesUrl(faculty, year, slug);
    const response = await fetchJsonFromSyllabus(newUrl);
    const modules = parseModules(response, faculty);
    return { modules };
  } catch (err) {
    console.error(err);
  }
  return {};
}

module.exports = { getProgrammesFromSyllabus, getModulesFromSyllabus };
