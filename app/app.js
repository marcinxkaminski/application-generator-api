const express = require('express');
const cors = require('cors');
const SyllabusController = require('./controllers/syllabusController');

const app = express();

// Settings
app.use(cors());
app.options('*', cors());

// Routes
app.use('/syllabus', SyllabusController);

// Server
module.exports = app;
