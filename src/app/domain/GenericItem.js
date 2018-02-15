// import Box from './Box';
// import Item from './Item';
import Status from './Status';

export default class GenericItem {
  constructor(id, status, name) {
    this.id = id;
    this.status = status || Status.new();
    this.name = name === undefined ? id : name;
  }
  //
  // isBox() {
  //   return this instanceof Box;
  // }
  //
  // isItem() {
  //   return this instanceof Item;
  // }
}
