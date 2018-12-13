import 'whatwg-fetch';
import { AbstractFamilyMember } from './abstract-family-member';

const WSReader = require('../third-party/ws/vizabi-ws-reader-node').WsReader;

export class GcpReader extends AbstractFamilyMember {
  getTitle(): string {
    return 'GCP based WS storage';
  }

  getObject() {
    return WSReader.getReader();
  }
}
