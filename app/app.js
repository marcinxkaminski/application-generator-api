const express = require('express');
const cors = require('cors');
const SyllabusController = require('./controllers/syllabusController');
<<<<<<< HEAD
// const GeneratorController = require('./controllers/generatorController');
=======
>>>>>>> 6923fbb780da154f46e5103d51dab9dbc55ea450

const app = express();
const port = process.env.PORT || 8080;

// Settings
app.use(cors());
app.options('*', cors());

// Routes
app.use('/syllabus', SyllabusController);
<<<<<<< HEAD
// app.use('/generator', GeneratorController);
=======
>>>>>>> 6923fbb780da154f46e5103d51dab9dbc55ea450

// Server
app.listen(port, 'localhost', function () {
  console.log('App is listening on %s:%s', this.address().address, this.address().port);
});
