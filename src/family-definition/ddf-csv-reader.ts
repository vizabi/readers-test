import { AbstractFamilyMember } from './abstract-family-member';

const ddfCsvReader = require('../third-party/ddfcsv-0.x/vizabi-ddfcsv-reader-node');

export class DdfCsvReader extends AbstractFamilyMember {
  private obj;

  getTitle(): string {
    return 'DDFcsv 0.14.5';
  }

  getObject() {
    if (!this.obj) {
      this.obj = ddfCsvReader.getDDFCsvReaderObject();
    }

    return this.obj;
  }
}
