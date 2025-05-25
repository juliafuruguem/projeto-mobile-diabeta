const express = require('express');
const router = express.Router();
const { criarHistorico, listarHistorico } = require('../controllers/historicoController');

router.post('/', criarHistorico);

router.get('/:userId', listarHistorico);

module.exports = router;