const router = require('express').Router();
const controller = require('../controllers/solverController');
const protection = require('../middlewares/authMiddleware');
router.post('/', protection.authenticate, controller.solve);
router.get('/fast', protection.authenticate, controller.getFastest);


module.exports = router;