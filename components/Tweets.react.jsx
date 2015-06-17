let React = require('react')
let Tweet = require('./Tweet.react.jsx')

class Tweets extends React.Component {

  render() {
        // Build list items of single tweet components using map
        let content = this.props.tweets.map((tweet) => {
          return (
            <Tweet key={tweet._id} tweet={tweet} />
          )
        });

        // Return ul filled with our mapped tweets
        return (
          <ul className="tweets">{content}</ul>
        )
   }
}

module.exports = Tweets
