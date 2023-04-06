const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
app.use(methodOverride('_method'));

//connecting to mongoose
const url = 'mongodb://127.0.0.1:27017/yelp-camp';
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
// event 'open' menggunakan 'once' karena hanya perlu dipanggil sekali
db.once('open', () => {
    console.log('CONNECTION OPEN!!!');
});
// event 'error' menggunakan 'on' karena perlu dipanggil jika terjadi error
db.on('error', err => {
    console.log('OH NO ERROR!!!');
    console.log(err);
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }));

//route to home.ejs
app.get('/', (req, res) => {
    res.render('home');
})
//READ
app.get('/index', async (req, res) => {
    const resultCamp = await Campground.find();
    res.render('campground/index', { resultCamp });
})
app.get('/new', (req, res) => {
    res.render('campground/new');
})
app.post('/make-campgrounds', async (req, res) => {
    // const { title, price, location, description } = req.body;
    const { title, price, location, description, images } = req.body.Campground;
    const camp = new Campground({ title, price, location, description, images });
    await camp.save();
    return res.redirect(`/campgroundDetail/${camp._id}`);
})

//FORM GET EDIT
app.get('/edit/:id/edit', async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findOne({ _id: id });
    res.render('campground/edit', { camp });
});

//EDIT PATCH(POST METHOD)
app.patch('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { title, price, location, description, images } = req.body.Campground;
    const foundCamp = await Campground.findOne({ _id: id });
    foundCamp.title = title;
    foundCamp.price = price;
    foundCamp.location = location;
    foundCamp.description = description;
    foundCamp.images = images;
    await foundCamp.save();
    // res.redirect('/index');
    return res.redirect(`/campgroundDetail/${foundCamp._id}`);
})

//DELETE
app.delete('/deleteOne/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.deleteOne({ _id: id });
    // console.log('delete selesai');
    res.redirect('/index');
});

//DETIAL
app.get('/campgroundDetail/:id', async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findOne({ _id: id });
    res.render('campground/show', { camp });
    // console.log(camp.images);
});


app.listen(3000, () => {
    console.log('LISTENING ON PORT 3000')
})