import Type from './Type';
import Status from './Status';
import GenericItem from './GenericItem';

export default class Item extends GenericItem {

  constructor(id, status, name, type, boxId) {
    super(id, status, name);

    this.type = type || Type.unknown();
    this.boxId = boxId;
  }

  static fromBox(box) {
    return new Item(box.id, box.status, box.name);
  }

  static fromOther(other) {
    return new Item(other.id, other.status, other.name, new Type(other.type.name), other.boxId);
  }

  static fromQRCode(qrCode) {
    return new Item(qrCode, Status.new(), null, Type.unknown());
  }

  isPendingNewStatus() {
    return true;
  }
}
