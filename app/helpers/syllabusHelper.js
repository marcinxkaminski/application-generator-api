const fetch = require('request-promise');

async function getModule() {
// mode: 'no-cors'
// cache: 'no-cache'


  fetch('https://syllabuskrk.agh.edu.pl/2017-2018/magnesite/api/faculties/weaiiib/study_plans/stacjonarne-elektrotechnika--3/modules/EEL-1-720-s')
    .then(res => res.json())
    .then((resJson) => { console.log(resJson); });
}

function requestProgrammes(year) {
  const urlForField = `https://syllabuskrk.agh.edu.pl/${year}/pl/magnesite/api/faculties/weaiiib/study_plans`;
  return sendRequest(urlForField);
}

// SEND REQUEST TO API FOR MODULES AND RETURNS JSON OBJECT
function requestModules(field) {
  let urlForModules = field.link.replace('/pl/magnesite/study_plans/', '/magnesite/api/faculties/weaiiib/study_plans/');
  urlForModules += '/modules?fields=name,module-code';
  return sendRequest(urlForModules);
}

// SEND REQUEST TO API FOR CERTAIN MODULE AND RETURNS JSON OBJECT
function requestCertainModule(field, code) {
  let urlForModule = field.link.replace('/pl/magnesite/study_plans/', '/magnesite/api/faculties/weaiiib/study_plans/');
  urlForModule += `/modules/${code}`;
  return sendRequest(urlForModule);
}

function sendRequest(url) {
  const request = new XMLHttpRequest();

  request.open('GET', url, false);
  // request.setRequestHeader('Accept-Language', 'pl');
  // request.setRequestHeader('Content-Type', 'application/json');
  // request.setRequestHeader('Accept', 'application/vnd.syllabus.agh.edu.pl.v2+json');
  request.send(null);
  return JSON.parse(request.responseText);
}

module.exports = { getModule };
