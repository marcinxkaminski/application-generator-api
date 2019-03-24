const fetch = require('node-fetch');

// const years = ['2016-2017', '2017-2018'];
// const faculties = ['weaiiib', 'weip', 'wfiis', 'wggiis', 'wggios', 'wgig', 'wh', 'wieit', 'wimic', 'wimiip', 'wimir', 'wmn', 'wms', 'wo', 'wwnig', 'wz'];

const faculties = ['weaiiib', 'weip', 'wfiis', 'wggiis', 'wggios', 'wgig', 'wh', 'wieit'];
const years = ['2016-2017', '2017-2018'];

// const faculties = ['weaiiib'];


function fetchSyllabus(url, method = 'GET') {
  const options = {
    method,
    mode: 'no-cors',
    cache: 'no-cache',
    headers: {
      'Accept-Language': 'pl',
      Accept: 'application/vnd.syllabus.agh.edu.pl.v2+json',
      'Content-Type': 'application/json',
    },
  };
  return fetch(url, options);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchJsonFromSyllabus(url) {
  try {
    const res = await fetchSyllabus(url);

    if (res.status !== 200) {
      await delay((Math.random() * 10000) + 20000);
      return fetchJsonFromSyllabus(url);
    }

    return res.json();
  } catch (err) {
    console.error(err);
  }
  return null;
}

async function getProgrammesForYear(faculty, year) {
  try {
    const res = await fetchJsonFromSyllabus(`https://syllabuskrk.agh.edu.pl/${year}/magnesite/api/faculties/${faculty}/study_plans`);
    return { year, year_programmes: res };
  } catch (err) {
    console.error(err);
  }

  return null;
}

async function getProgrammesForFaculty(faculty) {
  const yearsPromises = [];
  years.forEach((year) => {
    yearsPromises.push(getProgrammesForYear(faculty, year));
  });
  return { faculty, programmes: await Promise.all(yearsPromises) };
}

async function getProgrammes() {
  const programmesPromises = [];
  faculties.forEach((faculty) => {
    programmesPromises.push(getProgrammesForFaculty(faculty));
    // console.log(programmesPromises[faculty]);
  });
  return Promise.all(programmesPromises);
}

function getProgramModulesUrl(url, faculty) {
  const params = url.split('/');
  const year = params[3];
  const slug = params[7];
  return `https://syllabuskrk.agh.edu.pl/${year}/magnesite/api/faculties/${faculty}/study_plans/${slug}/modules?fields=name,ects-points`;
}

async function getModulesForStudyProgram(studyProgram, facultyName) {
  const result = studyProgram;
  const newUrl = getProgramModulesUrl(studyProgram.url, facultyName);
  result.modules = await fetchJsonFromSyllabus(newUrl);
  return result;
}

async function getModulesForStudyLevel(entry, facultyName) {
  const result = entry;
  result.study_programmes = await Promise.all(entry.study_programmes.map(async studyProgram => getModulesForStudyProgram(studyProgram, facultyName)));
  return result;
}

async function getModulesForStudyType(entry, facultyName) {
  const result = entry;
  result.levels = await Promise.all(entry.levels.map(async level => getModulesForStudyLevel(level, facultyName)));
  return result;
}

async function getModulesForYear(entry, facultyName) {
  const result = entry;
  result.syllabus.study_types = await Promise.all(entry.syllabus.study_types.map(async studyType => await getModulesForStudyType(studyType, facultyName)));
  return result;
}

async function getModulesForFaculty(entry) {
  const results = entry.programmes.map(async (element) => {
    const result = element;
    result.year_programmes = await getModulesForYear(element.year_programmes, entry.faculty);
    return result;
  });
  return Promise.all(results);
}

async function getModules(syllabus) {
  const results = syllabus.map(async (element) => {
    const result = element;
    result.programmes = await getModulesForFaculty(element);
    return result;
  });
  return Promise.all(results);
}

function parseModules(modules) {
  const parsed = {};

  if (modules.syllabus === undefined) {
    return {};
  }

  modules.syllabus.assignments.forEach((element) => {
    const mod = element.assignment.module;
    parsed[mod.name] = { ects: mod.ects_points };
  });
  return parsed;
}

function parseProgrammesForLevel(levelProgrammes) {
  const parsed = {};
  levelProgrammes.study_programmes.forEach((studyProgrammes) => {
    parsed[studyProgrammes.name] = parseModules(studyProgrammes.modules);
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

async function getSyllabus() {
  const entries = await getProgrammes();
  const completeEntries = await getModules(entries);
  const parsedEntries = parseProgrammes(completeEntries);
  return parsedEntries;
}

module.exports = { getSyllabus };
