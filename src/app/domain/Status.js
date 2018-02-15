class Status {

  constructor(name) {
    this.name = name;
  }

  static new() {
    return new Status(this.STATUS_NEW);
  }

  static in() {
    return new Status(this.STATUS_IN);
  }

  static out() {
    return new Status(this.STATUS_OUT);
  }
}

Status.STATUS_NEW = 'Ny';
Status.STATUS_IN = 'Inne';
Status.STATUS_OUT = 'Ute';

export default Status;
