'use strict'
let JSX = require('node-jsx').install() //important
let React = require('react')
let TweetsApp = require('./components/TweetsApp.react')
let Tweet = require('./models/Tweet')
let then = require('express-then')

require('songbird')


module.exports = (app) => {
    app.get('/', then(async(req, res) => {
        let tweets = await Tweet.promise.getTweets(0, 0)
        let markup = React.renderComponentToString(
            TweetsApp({
                tweets: tweets
            })
        )

        // Render our 'home' template
        res.render('home', {
            layout: 'main',
            markup: markup, // Pass rendered react markup
            state: JSON.stringify(tweets) // Pass current state to client side
        })
    }))


    app.get('/page/:page/:skip', then(async(req, res) => {
        let tweets = await Tweet.promise.getTweets(req.params.page, req.params.skip)
            // Render as JSON
        res.send(tweets)

    }))
}
