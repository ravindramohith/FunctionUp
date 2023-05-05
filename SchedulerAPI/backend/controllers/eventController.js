const Event = require('../models/Event');
const cron = require('node-cron');
const moment = require('moment-timezone');

exports.createEvent = async (req, res) => {
    const event = await Event.create(req.body);
    res.status(201).json({
        status: 'success',
        event
    });
}

exports.getEvents = async (req, res) => {
    const events = await Event.find({}, null, { sort: { dateTime: 1 } });
    res.status(200).json({
        status: 'success',
        events
    });
}

exports.triggerEvents = async (req, res) => {
    try {
        const events = await Event.find({})
        events.forEach((event) => {
            if (event.dateTime) {
                const job = cron.schedule(
                    moment(event.dateTime, 'YYYY-MM-DD HH:mm:ss.SSS', 'UTC').format('m H D M d'),
                    () => {
                        console.log('Cron job started:', moment().format('MMMM Do YYYY, h:mm:ss a'));
                        triggerFunction(event.text);
                    }
                );
                job.start();
            }
        });
        res.status(200).send('Events scheduled successfully.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error scheduling events.');
    }
}

// Function that should run when each job is triggered
function triggerFunction(text) {
    setTimeout(() => {
        const reversedText = text.split('').reverse().join('');
        console.log(`Reversed text: ${reversedText}`);
    }, text.length * 1000);
}