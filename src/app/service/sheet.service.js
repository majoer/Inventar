import { ipcRenderer } from 'electron';

function read(event, onReadComplete) {
  const completeEvent = `${event}:complete`;

  const callback = (event, response) => {
    ipcRenderer.removeListener(completeEvent, callback);
    onReadComplete(response);
  };

  ipcRenderer.send(event);
  ipcRenderer.on(completeEvent, callback);
}

function write() {
  ipcRenderer.send('sheet:write', {
    range: 'A1',
    values: [['Matssss']]
  });
  ipcRenderer.on('sheet:write:complete', (event, response) => {
    console.log(response);
  });
}

class SheetService {

  readAllItems(onReadComplete) {
    read('sheet:read:items', onReadComplete);
  }

  readAllTypes(onReadComplete) {
    read('sheet:read:types', onReadComplete);
  }

  write() {
    write();
  }
}

export const sheetService = new SheetService();

export default sheetService;
