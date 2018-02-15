import GenericItem from './GenericItem';

export default class Box extends GenericItem {

  constructor(id, status, name) {
    super(id, status, name);

    this.items = [];
  }

  static fromItem(item) {
    return new Box(item.id, item.status, item.name);
  }

  static fromOther(box) {
    return new Box(box.id, box.status, box.name);
  }

  addItem(item) {
    this.items.push(item);
  }

  removeItem(itemToRemove) {
    this.removeItemById(itemToRemove.id);
  }

  removeItemById(idToRemove) {
    this.items = this.items.filter((item) => item.id !== idToRemove);
  }
}
