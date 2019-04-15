import React from 'react';
import './Track.css';

class Track extends React.Component{
  constructor(props){
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
  }
  renderAction() {
    return this.props.isRemoval ? <a className="Track-action">-</a> : <a className="Track-action">+</a>;
  }
  removeTrack(e){
    let track = this.props.track;
    this.props.onRemove(track);
  }
  addTrack(e) {
    let track = this.props.track;
    this.props.onAdd(track);
  }
  render() {
    return (
      <div className="Track">
        <div className="Track-information">
          <h3>{this.props.track.name}</h3>
          <p>{`${this.props.track.artist} ${this.props.track.album}`}</p>
        </div>
        <a className="Track-action" onClick={this.props.isRemoval ? this.removeTrack : this.addTrack}>{this.props.isRemoval ? '-' : '+'}</a>
      </div>
    );
  }
}
export default Track;
