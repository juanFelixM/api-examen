const { Router } = require('express');
const {
  inscribirse,
  cancelarInscripcion,
  verTodas,
  verMisInscripciones
} = require('../controllers/inscripciones.controller');
const { verificarToken, soloAdmin } = require('../middlewares/auth');

const router = Router();

router.use(verificarToken);

router.post('/', inscribirse);
router.put('/:id/cancelar', cancelarInscripcion);
router.get('/', soloAdmin, verTodas);
router.get('/mis-inscripciones', verMisInscripciones);

module.exports = router;