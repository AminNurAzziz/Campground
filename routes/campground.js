const express = require('express');
const router = express.Router();
const CampgroundController = require('../controllers/campgroundController');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(CampgroundController.getAllCampgrounds);

router.route('/new')
    .get(isLoggedIn, CampgroundController.getNewCampground)
    .post(isLoggedIn, upload.array('image'), validateCampground, CampgroundController.postNewCampground);


router.route('/campgroundDetail/:id')
    .get(CampgroundController.getCampgroundDetail);

router.route('/edit/:id')
    .get(isLoggedIn, isAuthor, CampgroundController.getEditCampground)
    .patch(isLoggedIn, isAuthor, upload.array('image'), validateCampground, CampgroundController.patchEditCampground);

router.route('/deleteOne/:id')
    .delete(isLoggedIn, isAuthor, CampgroundController.deleteCampground);

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const CampgroundController = require('../controllers/campgroundController');
// const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');

// router.get('/', CampgroundController.getAllCampgrounds);
// router.get('/new', isLoggedIn, CampgroundController.getNewCampground);
// router.post('/make-campgrounds', isLoggedIn, validateCampground, CampgroundController.postNewCampground);
// router.get('/campgroundDetail/:id', CampgroundController.getCampgroundDetail);
// router.get('/edit/:id/edit', isLoggedIn, isAuthor, CampgroundController.getEditCampground);
// router.patch('/edit/:id', isLoggedIn, isAuthor, validateCampground, CampgroundController.patchEditCampground);
// router.delete('/deleteOne/:id', isLoggedIn, isAuthor, CampgroundController.deleteCampground);

// module.exports = router;

// ----------------------------------------------------------------------

// const express = require('express');
// const router = express.Router();
// const Campground = require('../models/campground')
// const catchAsync = require('../utils/catchAsync')
// const ExpressError = require('../utils/ExpressError')
// const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');

// //READ ALL
// router.get('/', catchAsync(async (req, res) => {
//     const resultCamp = await Campground.find();
//     res.render('campground/index', { resultCamp });
// }));
// //GET MAKE
// router.get('/new', isLoggedIn, (req, res) => {
//     res.render('campground/new');
// })
// //MAKE
// router.post('/make-campgrounds', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
//     // if (!req.body.Campground) throw new ExpressError('Invalid Campground Data', 400);
//     // console.log(req.body);
//     const camp = new Campground({ ...req.body.Campground });
//     camp.author = req.user._id;
//     await camp.save();
//     req.flash('success', 'Successfully made a new campground!');
//     res.redirect(`/campgrounds/campgroundDetail/${camp._id}`);
// }))

// //SHOW DETAIL
// router.get('/campgroundDetail/:id', catchAsync(async (req, res) => {
//     const { id } = req.params;
//     //POPULATE USE TO SHOW REVIEW INCLUDE IN CAMPGROUND
//     const camp = await Campground.findOne({ _id: id }).populate({
//         path: 'reviews',
//         populate: {
//             path: 'author'
//         }
//     }).populate('author');
//     console.log(camp)
//     if (!camp) {
//         req.flash('error', 'Cannot find that campground!');
//         return res.redirect('/campgrounds');
//     }
//     res.render('campground/show', { camp });
//     // console.log(camp.images);
// }));


// //FORM GET EDIT
// router.get('/edit/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
//     const { id } = req.params;
//     const camp = await Campground.findOne({ _id: id });
//     if (!camp) {
//         req.flash('error', 'Cannot find that campground!');
//         return res.redirect(`/campgroundDetail/${id}`);
//     }
//     res.render('campground/edit', { camp });
// }));

// //EDIT PATCH(POST METHOD)
// router.patch('/edit/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
//     const { id } = req.params;

//     const foundCamp = await Campground.findByIdAndUpdate(id, { ...req.body.Campground });
//     req.flash('success', 'Successfully updated campground!');
//     res.redirect(`/campgrounds/campgroundDetail/${foundCamp._id}`);
// }))

// //DELETE CAMPGROUND
// router.delete('/deleteOne/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
//     const { id } = req.params;
//     await Campground.findByIdAndDelete(id);
//     // await Campground.deleteOne({ _id: id });
//     // console.log('delete selesai');
//     req.flash('success', 'Successfully deleted campground!');
//     res.redirect('/campgrounds');
// }));



// module.exports = router;