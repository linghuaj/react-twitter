// Because we are working with a file that will be bundled with Browserify
// and will have access to JSX transforms, we can use JSX syntax when passing
// our component as an argument.

var React = require('react');
var TweetsApp = require('./components/TweetsApp.react.jsx');

// Snag the initial state that was passed from the server side
var initialState = JSON.parse(document.getElementById('initial-state').innerHTML);

// when using Browserify, we need a client side entry point to pick up the state we just saved, and mount our application component
// it will only performs the mount part, because server already rendered, the virtual dom will prevent it from another dom re-fresh
React.renderComponent(
  <TweetsApp tweets={initialState}/>,
  document.getElementById('react-app')
)
