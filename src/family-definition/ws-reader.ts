import 'whatwg-fetch';
import { AbstractFamilyMember } from './abstract-family-member';

const WSReader = require('../third-party/ws/vizabi-ws-reader-node').WsReader;

export class WsReader extends AbstractFamilyMember {
  private obj;

  getTitle(): string {
    return 'WS';
  }

  getObject() {
    if (!this.obj) {
      this.obj = WSReader.getReader();
    }

    return this.obj;
  }
}
