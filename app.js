const express = require('express')
const bodyParser = require('body-parser')



const app = express();

app.use(bodyParser.json())
const adminRoutes = require('./routes/adminRoute');
const ticketRoutes = require('./routes/ticketRoute');

app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/ticket',ticketRoutes);
module.exports = app;