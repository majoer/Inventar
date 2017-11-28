import { ipcRenderer } from 'electron';

export default {
  read: (onReadComplete) => {
    const callback = (event, response) => {
      ipcRenderer.removeListener('sheet.read.complete', callback);
      onReadComplete(response);
    };

    ipcRenderer.send('sheet.read', {
      range: 'A2:C8'
    });
    ipcRenderer.on('sheet.read.complete', callback);
  },

  write: () => {
    ipcRenderer.send('sheet.write', {
      range: 'A1',
      values: [['Matssss']]
    });
    ipcRenderer.on('sheet.write.complete', (event, response) => {
      console.log(response);
    });
  }
}
