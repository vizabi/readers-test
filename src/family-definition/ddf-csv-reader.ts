import { AbstractFamilyMember } from './abstract-family-member';

const ddfCsvReader = require('vizabi-ddfcsv-reader');

export class DdfCsvReader extends AbstractFamilyMember {
  private readerObject;

  getTitle(): string {
    return 'DDFcsv';
  }

  getReaderObject() {
    if (!this.readerObject) {
      this.readerObject = ddfCsvReader.getDDFCsvReaderObject();
    }

    return this.readerObject;
  }
}
