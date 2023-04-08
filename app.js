if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const session = require('express-session');
const app = express()
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const chalk = require('chalk');
const figlet = require('figlet');


//route import
const userRouter = require('./routes/user');
const campgroundRouter = require('./routes/campground');
const reviewRouter = require('./routes/review');

//connecting to mongoose
const url = 'mongodb://127.0.0.1:27017/yelp-camp';
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});
const db = mongoose.connection;
db.once('open', () => {
    console.log('CONNECTION OPEN!!!');
});
db.on('error', err => {
    console.log('OH NO ERROR!!!');
    console.log(err);
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '/public')));

const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//middleware to pass flash message to all template
app.use((req, res, next) => {
    // console.log(req.session)
    // console.log(req.user);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


//user route
app.use('/', userRouter);
//route to campgrounds
app.use('/campgrounds', campgroundRouter);
//route to reviews
app.use('/campgroundDetail/:id/reviews/', reviewRouter);
//route to home.ejs
app.get('/', (req, res) => { res.render('home'); })


//error route
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

//error handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).render('error', { err });
})

//listen to port 3000
app.listen(3000, () => {
    figlet('Selesai!!!', function (err, data) {
        if (err) {
            console.log('Error:', err);
            return;
        }
        console.log(data);
        console.log(chalk.black.bgYellow.bold('Server started and listening on port 3000!'));

    });
});