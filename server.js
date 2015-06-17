 // Server side main
 let http = require('http')
 let path = require('path')
 let express = require('express')
 let morgan = require('morgan')
 let mongoose = require('mongoose')
 let twitter = require('ntwitter')
 let routes = require('./routes')
 let config = require('./config')
 let streamHandler = require('./utils/streamHandler')
 require('hbs')

 // Create an express instance and set a port variable
 let app = express();
 let port = process.env.PORT || 8080

 //view engine and default layout
 app.set('views', path.join(__dirname, 'views'))
 app.set('view engine', 'hbs')
 //layout would be used in routes/render
 app.set('view options', {
     layout: 'main'
 })

 // log every request to the console
 app.use(morgan('dev'))
 // Disable etag headers on responses
 app.disable('etag')

 // Connect to our mongo database
 mongoose.connect('mongodb://localhost/react-tweets')

 routes(app)
 // Set /public as our static content dir
 app.use("/", express.static(__dirname + "/public/"))

 // Fire it up (start our server)
 let server = http.createServer(app).listen(port, () => {
     console.log(`Expresslisten to port ${port}`)
 })

 // Initialize socket.io
 let io = require('socket.io').listen(server)

 // Create a new ntwitter instance
 let twit = new twitter(config.twitter)

 // Set a stream listener for tweets matching tracking keywords
 twit.stream('statuses/filter', {
     track: '#reactjs, BarackObama'
 }, (stream) => {
     streamHandler(stream, io)
 })
