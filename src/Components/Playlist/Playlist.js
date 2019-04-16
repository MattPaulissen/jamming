import React from 'react';
import './Playlist.css';
import TrackList from '../TrackList/TrackList';

class Playlist extends React.Component{
  constructor(props){
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }
  handleNameChange(e) {
    let newName = e.target.value;
    this.props.onNameChange(newName);
  }
  handleSave(e) {
    this.props.onSave();
    //Reset input field after saving
    document.getElementById("playlistName").value = 'New Playlist';
  }
  render() {
    return (
      <div className="Playlist">
        <input id="playlistName" defaultValue={'New Playlist'} onChange={this.handleNameChange}/>
        <TrackList tracks={this.props.playlistTracks}
                  onRemove={this.props.onRemove}
                  isRemoval={true} />
                <a className="Playlist-save" onClick={this.handleSave}>SAVE TO SPOTIFY</a>
      </div>
    );
  }
}

export default Playlist;
