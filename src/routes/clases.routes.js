const { Router } = require('express');
const { listarClases, crearClase, desactivarClase } = require('../controllers/clases.controller');
const { verificarToken, soloAdmin } = require('../middlewares/auth');

const router = Router();

router.use(verificarToken);

router.get('/', listarClases);
router.post('/', soloAdmin, crearClase);
router.put('/:id/desactivar', soloAdmin, desactivarClase);

module.exports = router;9