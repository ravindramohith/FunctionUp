const app = require('express')();
const userRouter = require('./routes/userRouter')
const solverRouter = require('./routes/solverRouter')
const cors = require('cors');


app.use(require('express').json());
app.use(cors());
app.use('/', userRouter);
app.use('/solver', solverRouter);

module.exports = app;