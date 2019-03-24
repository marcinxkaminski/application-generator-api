const express = require('express');
const cors = require('cors');
const SyllabusController = require('./controllers/syllabusController');
// const GeneratorController = require('./controllers/generatorController');

const app = express();
const port = process.env.PORT || 8080;

// Settings
app.use(cors());
app.options('*', cors());

// Routes
app.use('/syllabus', SyllabusController);
// app.use('/generator', GeneratorController);

// Server
app.listen(port, 'localhost', function () {
  console.log('App is listening on %s:%s', this.address().address, this.address().port);
});
