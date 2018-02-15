import { ipcRenderer } from 'electron';
import Box from '../domain/Box';
import Item from '../domain/Item';

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

  readAllBoxes(onReadComplete) {
    read('sheet:read:boxes', (boxes) => {
      onReadComplete(boxes.map((box) => Box.fromOther(box)));
    });
  }

  readAllItems(onReadComplete) {
    read('sheet:read:items', (items) => {
      onReadComplete(items.map((item) => Item.fromOther(item)));
    });
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
