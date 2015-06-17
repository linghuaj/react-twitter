let  React = require('react')

class Loader extends React.Component {
  render() {
    return (
      <div className={"loader " + (this.props.paging ? "active" : "")}>
        <img src="svg/loader.svg" />
      </div>
    )
   }
}

module.exports = Loader
