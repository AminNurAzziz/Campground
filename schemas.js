const Joi = require('joi');


// campground schema validation
module.exports.campgroundSchema = Joi.object({
    Campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        // images: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()
})


// review schema validation
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        // rating: Joi.number().required().min(1).max(5),
        rating: Joi.number().required().max(5),
        body: Joi.string().required()
    }).required()
});