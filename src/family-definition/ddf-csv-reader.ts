import { AbstractFamilyMember } from './abstract-family-member';

const ddfCsvReader = require('../third-party/ddfcsv-2.0/vizabi-ddfcsv-reader-node');

export class DdfCsvReader extends AbstractFamilyMember {
  getTitle(): string {
    return 'DDFcsv 2.0.2';
  }

  getObject() {
    return ddfCsvReader.getDDFCsvReaderObject();
  }
}
