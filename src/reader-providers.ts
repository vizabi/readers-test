import { cloneDeep } from 'lodash';
import { Dataset } from './datasets';

const ddfCsvReader = require('vizabi-ddfcsv-reader');

export abstract class AbstractReaderProvider {
  title: string;
  dataset: Dataset;
  initData;

  abstract getReaderObject();

  withTitle(title: string) {
    this.title = title;

    return this;
  }

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
    if (!this.title) {
      throw Error('"title" should be defined');
    }

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

  getReaderObject() {
    if (!this.readerObject) {
      this.readerObject = ddfCsvReader.getDDFCsvReaderObject();
    }

    return this.readerObject;
  }
}
