// require('dotenv').config();

const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { cloudinary } = require('../cloudinary');
const axios = require('axios');

// READ ALL
module.exports.getAllCampgrounds = catchAsync(async (req, res) => {
    const resultCamp = await Campground.find();
    res.render('campground/index', { resultCamp });
});

// GET MAKE
module.exports.getNewCampground = (req, res) => {
    res.render('campground/new');
};

// MAKE
module.exports.postNewCampground = catchAsync(async (req, res, next) => {
    const location = req.body.Campground.location;
    const mapquestApiKey = process.env.MAPSQUEST_API_KEY;
    const url = `http://www.mapquestapi.com/geocoding/v1/address?key=${mapquestApiKey}&location=${location}`;
    console.log(url);
    const response = await axios.get(url);
    const { lat, lng } = response.data.results[0].locations[0].latLng;

    const camp = new Campground(req.body.Campground);
    camp.geometry = {
        type: 'Point',
        coordinates: [lng, lat]
    };
    // res.send(camp.geometry.coordinates);
    camp.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    camp.author = req.user._id;
    await camp.save();
    // console.log(camp);
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/campgroundDetail/${camp._id}`);
});

// SHOW DETAIL
module.exports.getCampgroundDetail = catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!camp) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campground/show', { camp });
});

// GET EDIT FORM
module.exports.getEditCampground = catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    // console.log(camp.images[0].thumbnail)
    if (!camp) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect(`/campgroundDetail/${id}`);
    }
    res.render('campground/edit', { camp });
});

// EDIT CAMPGROUND
module.exports.patchEditCampground = catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.Campground });
    const location = req.body.Campground.location;
    const mapquestApiKey = process.env.MAPSQUEST_API_KEY;
    const url = `http://www.mapquestapi.com/geocoding/v1/address?key=${mapquestApiKey}&location=${location}`;
    const response = await axios.get(url);
    const { lat, lng } = response.data.results[0].locations[0].latLng;
    camp.geometry = {
        type: 'Point',
        coordinates: [lng, lat]
    };

    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.images.push(...imgs);
    if (req.body.deleteImages) {
        for (let filenamee of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filenamee);
        }
        await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    await camp.save();
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/campgroundDetail/${camp._id}`);
});


// DELETE CAMPGROUND
module.exports.deleteCampground = catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
});
