import { getReader } from '../ddfcsv-new/reader';
import { AbstractFamilyMember } from './abstract-family-member';

export class DdfCsvNewReader extends AbstractFamilyMember {
  private readerObject;

  getTitle(): string {
    return 'DDFcsvNEW';
  }

  getReaderObject() {
    if (!this.readerObject) {
      this.readerObject = getReader();
    }

    return this.readerObject;
  }
}
