'use strict'
let React = require('react')
let Tweets = require('./Tweets.react.jsx')
let Loader = require('./Loader.react.jsx')
let NotificationBar = require('./NotificationBar.react.jsx')


class TweetsApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tweets: props.tweets,
      count: 0,
      page: 0,
      paging: false,//is it in paging? if so show the loader
      skip: 0,
      done: false
    }
  }


  // we need to use the componentWillReceiveProps method to make sure that if we mount our component
  // again, that it will receive the state
  componentWillReceiveProps(newProps, oldProps) {
    this.setState(this.getInitialState(newProps));
  }


  // Called directly after component rendering, only on client
  componentDidMount() {
    let self = this;
    // Initialize socket.io
    let socket = io.connect();

    // On tweet event emission...
    socket.on('tweet', function (data) {
      // Add a tweet to our queue
      self.addTweet(data);
    });
    // Attach scroll event to the window for infinity paging
    window.addEventListener('scroll', this.checkWindowScroll.bind(this));
  }


  //when receive a new tweet from socket.io, set a new state
  addTweet(tweet) {

    // Get current application state
    let updated = this.state.tweets;

    // Increment the unread count
    let count = this.state.count + 1;

    // Increment the skip count
    let skip = this.state.skip + 1;

    // Add tweet to the beginning of the tweets array
    updated.unshift(tweet);

    // Set application state
    this.setState({tweets: updated, count: count, skip: skip});

  }


  // Method to show the unread tweets
  // triggered from clicking on the notification bar
  // passed to notificationbar as props function
  showNewTweets(){

    // Get current application state
    let updated = this.state.tweets;
    // Mark our tweets active
    updated.forEach(function(tweet){
      tweet.active = true;
    });

    // Set application state (active tweets + reset unread count)
    this.setState({tweets: updated, count: 0});

  }


  // Method to check if more tweets should be loaded, by scroll position
  checkWindowScroll(){

    // Get scroll pos & window data
    let h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    let s = document.body.scrollTop;
    let scrolled = (h + s) > document.body.offsetHeight -100;

    // If scrolled enough, not currently paging and not complete...
    if(scrolled && !this.state.paging && !this.state.done) {

      // Set application state (Paging, Increment page)
      this.setState({paging: true, page: this.state.page + 1});

      // Get the next page of tweets from the server
      this.getPage(this.state.page);

    }
  }

  // Method to get JSON from server by page
  getPage(page) {
    // Setup our ajax request
    let request = new XMLHttpRequest()
    let self = this

    request.open('GET', 'page/' + page + "/" + this.state.skip, true);

    request.onload = function() {
      // If everything is cool...
      if (request.status >= 200 && request.status < 400){
        // Load our next page
        self.loadPagedTweets(JSON.parse(request.responseText));
      } else {
        // Set application state (Not paging, paging complete)
        self.setState({paging: false, done: true});
      }
    }
    request.send();
  }


  // Method to load tweets fetched from the server
  loadPagedTweets(tweets){
    let self = this;
    // If we still have tweets...
    if(tweets.length > 0) {

      // Get current application state
      let updated = this.state.tweets;

      // Push them onto the end of the current tweets array
      tweets.forEach(function(tweet){
        updated.push(tweet);
      });

      // This app is so fast, I actually use a timeout for dramatic effect
      // Otherwise you'd never see our super sexy loader svg
      setTimeout(function(){

        // Set application state (Not paging, add tweets)
        self.setState({tweets: updated, paging: false});

      }, 1000);

    } else {

      // Set application state (Not paging, paging complete)
      this.setState({done: true, paging: false});

    }
  }


  // Render the component
  render() {
    return (
      <div className="tweets-app">
        <Tweets tweets={this.state.tweets} />
        <Loader paging={this.state.paging}/>
        <NotificationBar count={this.state.count} onShowNewTweets={this.showNewTweets.bind(this)}/>
      </div>
    )
  }
}

module.exports = TweetsApp
