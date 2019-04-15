let accessToken = '';
const clientID = 'fdc754ed6e93426c8f02e00e9ea43bf6';
const redirectURI = 'http://jamming-mattp.surge.sh/';
let expiresIn = ''
const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    } else if (window.location.href.match(/access_token=([^&]*)/)
              && window.location.href.match(/expires_in=([^&]*)/)) {
      accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
      expiresIn = window.location.href.match(/expires_in=([^&]*)/)[1];
      window.setTimeout( () => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      let url = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
      window.location = url;
    }
  },
  async search(term){
    try {
      let header = {
        headers: {Authorization: `Bearer ${accessToken}`}
      };
      const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, header);
      if (response.ok) {
        const jsonResponse = await response.json();
        const tracks = jsonResponse.tracks.items.map(item => {
          return ({
            id: item.id,
            name: item.name,
            artist: item.artists[0].name,
            album: item.album.name,
            uri: item.uri
          });
        });
        return tracks;
      }
      throw new Error('Request Failed!');
    } catch(error) {
      console.log(error);
    }
  },
  async savePlaylist(name, tracks){
    let userAccessToken = this.getAccessToken();
    let header = {
      headers: {Authorization: `Bearer ${accessToken}`}
    };
    let userId = '';
    try {
      const response = await fetch('https://api.spotify.com/v1/me', header);
      if (response.ok) {
        const jsonResponse = await response.json();
        userId = jsonResponse.id;
        const newPlaylistResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          method: 'POST',
          headers: {Authorization: `Bearer ${accessToken}`,
                    'Content-type': 'application/json'},
          body: JSON.stringify({name: name})
        });
        if (newPlaylistResponse.ok) {
          const jsonPlaylistResponse = await newPlaylistResponse.json();
          let playlistId = jsonPlaylistResponse.id;
          let uriArray = tracks.map(item => {
            return item.uri;
          });
          const addSongsResonse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            method: 'POST',
            headers: {Authorization: `Bearer ${accessToken}`,
                      'Content-type': 'application/json'},
            body: JSON.stringify({uris: uriArray})
          });
          if (addSongsResonse.ok){
            return;
          }
        }
      }
      throw new Error('Request Failed');
    } catch(error) {
      console.log(error);
    }
  }
};
export default Spotify;
