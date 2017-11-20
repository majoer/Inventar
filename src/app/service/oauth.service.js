import { ipcRenderer } from 'electron';

export default {
  authorize: (onAuthorizeComplete) => {
    const callback = (event, redirectUri) => {
      ipcRenderer.removeListener('oauth.redirectUri', callback);
      onAuthorizeComplete(redirectUri);
    };

    ipcRenderer.send('oauth.authorize');
    ipcRenderer.on('oauth.redirectUri', callback);
  },
  token: (authorizationCode, onTokenComplete) => {
    ipcRenderer.send('oauth.token', authorizationCode);
    ipcRenderer.on('oauth.tokenComplete', onTokenComplete);
  }
}
