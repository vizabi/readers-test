import { DataSource } from "../settings/datasources";

export abstract class AbstractFamilyMember {
  dataSource: DataSource;
  initData;

  abstract getTitle(): string;

  abstract getObject();

  forDataSource(datset: DataSource) {
    this.dataSource = datset;

    return this;
  }

  init(initData) {
    this.initData = initData;

    return this;
  }

  checkConstraints() {
    if (!this.initData) {
      throw Error('"provider" should be initialized');
    }
  }

  read(request, onRead) {
    const readerObject = this.getObject();

    readerObject.init(this.initData);
    readerObject.read(request).then(data => {
      onRead(null, data);
    }).catch(err => {
      onRead(err);
    });
  }

  getAsset(asset, onRead) {
    const readerObject = this.getObject();

    readerObject.init(this.initData);
    readerObject.getAsset(asset).then(data => {
      onRead(null, data);
    }).catch(err => {
      onRead(err);
    });
  }
}
