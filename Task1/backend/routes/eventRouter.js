const Event = require('../models/Event');
const eventController = require('../controllers/eventController');
const router = require('express').Router();

router.post('/event', eventController.createEvent).get('/event', eventController.getEvents);
router.get('/trigger', eventController.triggerEvents);

module.exports = router;