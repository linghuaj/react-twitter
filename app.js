/** @jsx React.DOM */

var React = require('react');
var TweetsApp = require('./components/TweetsApp.react');

// Snag the initial state that was passed from the server side
var initialState = JSON.parse(document.getElementById('initial-state').innerHTML);

// Render the components, picking up where react left off on the server

// Because we are working with a file that will be bundled with Browserify
// and will have access to JSX transforms, we can use JSX syntax when passing
// our component as an argument.
React.renderComponent(
  <TweetsApp tweets={initialState}/>,
  document.getElementById('react-app')
)