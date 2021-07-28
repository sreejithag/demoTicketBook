const mongoose = require('mongoose')
const dotenv = require('dotenv');

dotenv.config({
    path: './config.env'
});

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION!!! shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

const app = require('./app');

const database = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

//db connection
mongoose.connect(database, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(con => {
    console.log('DB connected');
});

const port = process.env.PORT;

app.listen(port, () => {
    console.log('server started');
});


process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION!!!  shutting down ...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});