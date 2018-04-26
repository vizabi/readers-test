import 'whatwg-fetch';
import { AbstractFamilyMember } from './abstract-family-member';

const WSReader = require('../third-party/ws-mongoless/vizabi-ws-reader-node').WsReader;

export class WsReaderMongoless extends AbstractFamilyMember {
  getTitle(): string {
    return 'WS mongoless';
  }

  getObject() {
    return WSReader.getReader();
  }
}
