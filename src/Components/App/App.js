import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify.js';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      searchResults : [

      ],
      playlistName: '',
      playlistTracks: [

      ]
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savedPlaylist = this.savedPlaylist.bind(this);
    this.search = this.search.bind(this);
  }
  addTrack(track){
    //Check to see if track is already in playlist
    if (this.state.playlistTracks.some(item => {
      return item.id === track.id;
    })) {
      return;
    } else {
      this.setState(state => {
        const list = state.playlistTracks.concat(track);  //Add track to playlist array
        return {
          playlistTracks: list
        };
      });
    }
  }
  removeTrack(track) {
    this.setState(state => {
      const list = state.playlistTracks.filter(item => {  //filter track from playlist
        return item.id !== track.id;
      });
      return {
        playlistTracks : list
      };
    });
  }
  updatePlaylistName(name) {
    this.setState({playlistName:name});
  }
  savedPlaylist() {
    if (this.state.playlistName){ //Make sure playlist name isn't blonk before saving
      Spotify.savePlaylist(this.state.playlistName, this.state.playlistTracks).then( () => {
        this.setState({
          playlistName: 'New Playlist',
          playlistTracks: [

          ]
        });
      });
    } else {
      console.log('Please enter a playlist name');
    }
  }
  search(term) {
    Spotify.getAccessToken(); //Make sure we have an access token before searching
    Spotify.search(term).then(response => {
      this.setState({searchResults: response});
    });
  }
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
            <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName}
                      playlistTracks={this.state.playlistTracks}
                      onRemove={this.removeTrack}
                      onNameChange={this.updatePlaylistName}
                      onSave={this.savedPlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
