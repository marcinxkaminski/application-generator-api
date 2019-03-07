const express = require('express');

const router = express.Router();
const SyllabusMiddleware = require('../middlewares/syllabusMiddleware');

router.get('/departments', SyllabusMiddleware.departments);
router.get('/cycles', SyllabusMiddleware.cycles);
router.get('/types', SyllabusMiddleware.types);
router.get('/faculties', SyllabusMiddleware.faculties);
router.get('/years', SyllabusMiddleware.years);
router.get('/subjects', SyllabusMiddleware.subjects);
router.get('/prices', SyllabusMiddleware.prices);

module.exports = router;
