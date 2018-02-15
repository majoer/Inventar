class Type {

  constructor(name) {
    this.name = name;
  }

  static unknown() {
    return new Type(this.TYPE_UNKNOWN);
  }

  static box() {
    return new Type(this.TYPE_BOX);
  }

  isUnknown() {
    return this.name === this.TYPE_UNKNOWN;
  }

  isBox() {
    return this.name === this.TYPE_BOX;
  }
}

Type.TYPE_UNKNOWN = 'Ukjent';
Type.TYPE_BOX = 'Eske';

export default Type;
