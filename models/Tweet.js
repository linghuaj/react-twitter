'use strict'
let mongoose = require('mongoose')

// Create a new schema for our tweet data
let schema = new mongoose.Schema({
    twid: String,
    active: Boolean,
    author: String,
    avatar: String,
    body: String,
    date: Date,
    screenname: String
})

// Create a static getTweets method to return tweet data from the db
schema.statics.getTweets = function(page, skip, callback) {

    let tweets = []
    let start = (page * 10) + (skip * 1)

    // Query the db, using skip and limit to achieve page chunks
    Tweet.find({}, 'twid active author avatar body date screenname', {
        skip: start,
        limit: 10
    }).sort({
        date: 'desc'
    }).exec(function(err, docs) {
        if (!err) {
            tweets = docs; // We got tweets
            tweets.forEach(function(tweet) {
                tweet.active = true; // Set them to active
            })
        }
        // Pass them back to the specified callback
        callback(null, tweets)
    })
}

// Return a Tweet model based upon the defined schema
let Tweet = mongoose.model('Tweet', schema)
module.exports = Tweet
