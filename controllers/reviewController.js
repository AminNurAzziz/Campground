const Review = require('../models/review')
const Campground = require('../models/campground')
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')


module.exports.createReview = catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    camp.reviews.push(review);
    if (review.rating === 0) {
        req.flash('error', 'Rating cannot be 0!');
    } else {
        await review.save();
        await camp.save();
        req.flash('success', 'Successfully made a new review!');
    }
    res.redirect(`/campgrounds/campgroundDetail/${camp._id}`);
});

module.exports.deleteReview = catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review');
    res.redirect(`/campgrounds/campgroundDetail/${id}`);
});
