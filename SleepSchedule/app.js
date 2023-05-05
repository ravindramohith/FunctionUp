const app = require('express')();
const userRouter = require('./routes/userRouter')

app.use(require('express').json());
app.use('/', userRouter);

module.exports = app;