import 'whatwg-fetch';
import { AbstractFamilyMember } from './abstract-family-member';

const WSReader = require('../third-party/ws/vizabi-ws-reader-node').WsReader;

export class S3Reader extends AbstractFamilyMember {
  getTitle(): string {
    return 'S3 based WS storage';
  }

  getObject() {
    return WSReader.getReader();
  }
}
