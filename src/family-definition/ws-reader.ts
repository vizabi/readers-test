import 'whatwg-fetch';
import { AbstractFamilyMember } from './abstract-family-member';

const WSReader = require('../third-party/ws/vizabi-ws-reader-node').WsReader;

export class WsReader extends AbstractFamilyMember {
  getTitle(): string {
    return 'WS';
  }

  getObject() {
    return WSReader.getReader();
  }
}
