const fetch = require('node-fetch');

const faculties = ['weaiiib', 'weip', 'wfiis', 'wggiis', 'wggios', 'wgig', 'wh', 'wieit', 'wimic', 'wimiip', 'wimir', 'wmn', 'wms', 'wo', 'wwnig', 'wz'];
const years = ['2012-2013', '2013-2014', '2014-2015', '2015-2016', '2016-2017', '2017-2018', '2018-2019'];

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
  for (var i = 0; i <= attemptsNumber; ++i) {
    const res = await fetchSyllabus(url);

    if (res.status === 200) {
      return res.json();
    }
  }
  return {};
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
    const res = await attemptToFetchSyllabus(`https://syllabuskrk.agh.edu.pl/${year}/magnesite/api/faculties/${faculty}/study_plans`, 10);
    return { year, year_programmes: res };
  } catch (err) {
    console.error(err);
  }

  return null;
}

async function fetchProgrammesForFaculty(faculty) {
  const yearsPromises = [];
  years.forEach((year) => {
    yearsPromises.push(fetchProgrammesForYear(faculty, year));
  });
  return { faculty, programmes: await Promise.all(yearsPromises) };
}

async function fetchProgrammes() {
  const programmesPromises = [];
  faculties.forEach((faculty) => {
    programmesPromises.push(fetchProgrammesForFaculty(faculty));
  });
  return Promise.all(programmesPromises);
}

function getProgramModulesUrl(faculty, year, slug) {
  return `http://syllabuskrk.agh.edu.pl/${year}/magnesite/api/faculties/${faculty}/study_plans/${slug}/modules`;
}

function parseModuleOwner(mod) {
  const moduleOwner = mod.module_owner;
  if (moduleOwner != null) {
    let title = moduleOwner.employee_title;
    if (title == null) {
      title = '';
    } else {
      title += ' ';
    }
    return `${title}${moduleOwner.name} ${moduleOwner.surname}`;
  }
  return 'undefined';
}

function parseModuleActivities(mod) {
  const activities = {};
  mod.module_activities.forEach((element) => {
    const activity = element.module_activity;
    activities[activity.type] = activity.classes_hours;
  });
  return activities;
}

function parseModules(modules) {
  const parsed = {};

  modules.syllabus.assignments.forEach((element) => {
    const mod = element.assignment.module;
    parsed[mod.name] = {
      code: element.assignment.module_code,
      ects: mod.ects_points,
      owner: parseModuleOwner(mod),
      activities: parseModuleActivities(mod),
    };
  });
  return parsed;
}

function parseProgram(studyProgram) {
  const params = studyProgram.url.split('/');
  const year = params[3];
  const slug = params[7];

  return { year, slug };
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

async function getProgrammesFromSyllabus() {
  const entries = await fetchProgrammes();
  const parsedEntries = parseProgrammes(entries);
  return parsedEntries;
}

async function getModulesFromSyllabus(faculty, year, slug) {
  try {
    const newUrl = getProgramModulesUrl(faculty, year, slug);
    const response = await fetchJsonFromSyllabus(newUrl);
    const modules = parseModules(response);
    return modules;
  } catch (err) {
    console.log(err);
  }
  return {};
}

module.exports = { getProgrammesFromSyllabus, getModulesFromSyllabus };
