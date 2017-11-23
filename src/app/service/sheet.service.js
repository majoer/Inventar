import { ipcRenderer } from 'electron';

export default {
  read: () => {
    const callback = (event, response) => {
      ipcRenderer.removeListener('sheet.read.complete', callback);
      console.log(response);
    };

    ipcRenderer.send('sheet.read', {
      range: 'A1'
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
