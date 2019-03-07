const express = require('express');

const router = express.Router();
const GeneratorMiddleware = require('../middlewares/generatorMiddleware');

router.post('/', GeneratorMiddleware.generate);
