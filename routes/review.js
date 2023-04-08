const express = require('express');
const router = express.Router({ mergeParams: true });
const reviewController = require('../controllers/reviewController');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

router.post('/', isLoggedIn, validateReview, reviewController.createReview);

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, reviewController.deleteReview);

module.exports = router;



// const express = require('express');
// const router = express.Router({ mergeParams: true });
// const Review = require('../models/review')
// const Campground = require('../models/campground')
// const catchAsync = require('../utils/catchAsync')
// const ExpressError = require('../utils/ExpressError')
// const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

// //CREATE REVIEW
// router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
//     const { id } = req.params;
//     const camp = await Campground.findById(id);
//     const review = new Review(req.body.review);
//     review.author = req.user._id;
//     camp.reviews.push(review);
//     await review.save();
//     await camp.save();
//     req.flash('success', 'Successfully made a new review!');
//     res.redirect(`/campgrounds/campgroundDetail/${camp._id}`);
// }))

// //DELETE REVIEW
// router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
//     const { id, reviewId } = req.params;
//     await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
//     await Review.findByIdAndDelete(reviewId);
//     req.flash('success', 'Successfully deleted review');
//     res.redirect(`/campgrounds/campgroundDetail/${id}`);
// }));

// module.exports = router;