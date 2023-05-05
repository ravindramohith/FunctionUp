const app = require('express')();
const eventRouter = require('./routes/eventRouter');
const Event = require('./models/Event');

app.use(require('express').json());
app.use('/', eventRouter);


module.exports = app;