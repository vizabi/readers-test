import { DataSource } from "../settings/datasources";

export abstract class AbstractFamilyMember {
  dataSource: DataSource;
  initData;

  abstract getTitle(): string;

  abstract getReaderObject();

  forDataSource(datset: DataSource) {
    this.dataSource = datset;

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
