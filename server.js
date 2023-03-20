const express = require('express')
require('./server/db/mongoose')
    bodyParser = require('body-parser'),
    path = require('path'),
    fs = require('fs');
  const userRouter = require('./server/routers/routeTour.js')
const taskRouter = require('./server/routers/routeSite.js')
const port = 3001;

const app=express()
var proj4 = require('proj4');
app.use('/list', express.static(path.join(__dirname, 'client/html/index.html')));
app.use('/add_trip', express.static(path.join(__dirname, 'client/html/add_trip_form.html')));
app.use('/add_site', express.static(path.join(__dirname, 'client/html/add_site_form.html')));
app.use('/js', express.static(path.join(__dirname, 'client/js')));
app.use('/css', express.static(path.join(__dirname, 'client/css')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', userRouter);
app.use('/', taskRouter);
const server = app.listen(port, () => {
    console.log('listening on port server %s...', server.address().port);
});