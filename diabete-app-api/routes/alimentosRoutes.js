const express = require('express');
const router = express.Router();
const { getAlimentos } = require('../controllers/alimentosController');

router.get('/', getAlimentos);

module.exports = router;
