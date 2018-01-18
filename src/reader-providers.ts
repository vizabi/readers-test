import { Dataset } from './settings/datasets';
import { getReader } from './ddfcsv-new/reader';

const ddfCsvReader = require('vizabi-ddfcsv-reader');

export abstract class AbstractReaderProvider {
  dataset: Dataset;
  initData;

  abstract getTitle(): string;

  abstract getReaderObject();

  forDataset(datset: Dataset) {
    this.dataset = datset;

    return this;
  }

  init(initData) {
    this.initData = initData;

    this.getReaderObject().init(initData);

    return this;
  }

  checkConstraints() {
    if (!this.initData) {
      throw Error('"provider" should be initialized');
    }
  }

  read(request, onRead) {
    this.getReaderObject().read(request).then(data => {
      onRead(null, data);
    }).catch(err => {
      onRead(err);
    });
  }
}


export class DdfCsvReaderProvider extends AbstractReaderProvider {
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

export class DdfCsvNewReaderProvider extends AbstractReaderProvider {
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
