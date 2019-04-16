import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      term: ''
    };
    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
  }
  search(e) {
    if (this.state.term) {  //Make sure that we have a search term before sending search
      this.props.onSearch(this.state.term);
    } else {
      console.log('Please enter a search term');
    }

  }
  handleTermChange(e) {
    let term = e.target.value;
    this.setState({
      term,
    });
  }
  render() {
    return (
      <div className="SearchBar">
        <input onChange={this.handleTermChange} placeholder="Enter A Song, Album, or Artist" />
        <a onClick={this.search}>SEARCH</a>
      </div>
    );
  }
}
export default SearchBar;
