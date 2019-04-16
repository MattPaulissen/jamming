//Spotify auth information
let accessToken = '';
const clientID = 'fdc754ed6e93426c8f02e00e9ea43bf6';
const redirectURI = 'http://jamming-mattp.surge.sh/';
let expiresIn = ''
const Spotify = {
  //Function to get access token
  getAccessToken() {
    if (accessToken) {
      return accessToken; //If access token exists then return it
    } else if (window.location.href.match(/access_token=([^&]*)/)
              && window.location.href.match(/expires_in=([^&]*)/)) {
      accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
      expiresIn = window.location.href.match(/expires_in=([^&]*)/)[1];
      window.setTimeout( () => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken; //if access token exists in the nav bar then move them into local vars and return them
    } else {  //Else redirect to spotify implicit grant url
      let url = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
      window.location = url;
    }
  },
  async search(term){
    try {
      let header = {
        headers: {Authorization: `Bearer ${accessToken}`} //Build header
      };
      //Await response from api for search
      const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, header);
      if (response.ok) {  //Check for ok response
        const jsonResponse = await response.json(); //parse json
        //Map response items to tracks
        const tracks = jsonResponse.tracks.items.map(item => {
          return ({
            id: item.id,
            name: item.name,
            artist: item.artists[0].name,
            album: item.album.name,
            uri: item.uri,
            img: item.album.images[2]
          });
        });
        return tracks; //return tracks
      }
      //Error handling
      throw new Error('Request Failed!');
    } catch(error) {
      console.log(error);
    }
  },
  //Function to save playlists
  async savePlaylist(name, tracks){
    let userAccessToken = this.getAccessToken();
    let header = {
      headers: {Authorization: `Bearer ${accessToken}`} //Build header
    };
    let userId = '';
    try {
      //await response from API for user ID
      const response = await fetch('https://api.spotify.com/v1/me', header);
      if (response.ok) {
        const jsonResponse = await response.json();
        userId = jsonResponse.id;
        //User user ID from first call to create a new playlist
        const newPlaylistResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          method: 'POST',
          headers: {Authorization: `Bearer ${accessToken}`,
                    'Content-type': 'application/json'},
          body: JSON.stringify({name: name})
        });
        if (newPlaylistResponse.ok) { //Check for ok response
          const jsonPlaylistResponse = await newPlaylistResponse.json();
          let playlistId = jsonPlaylistResponse.id;
          //Map tracks to array of URIs to send to the api
          let uriArray = tracks.map(item => {
            return item.uri;
          });
          //Perform request to add all songs to the current playlist
          const addSongsResonse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            method: 'POST',
            headers: {Authorization: `Bearer ${accessToken}`,
                      'Content-type': 'application/json'},
            body: JSON.stringify({uris: uriArray})
          });
          if (addSongsResonse.ok){
            return; //No errors in function, return promise
          }
        }
      }
      //Error handling
      throw new Error('Request Failed');
    } catch(error) {
      console.log(error);
    }
  }
};
export default Spotify;
