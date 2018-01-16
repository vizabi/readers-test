import { ddfCsvReader } from './index';

const Promise = require('bluebird');

export function getReader() {
  return {
    init(readerInfo) {
      this._basepath = readerInfo.path;
      this._lastModified = readerInfo._lastModified;
    },

    getAsset(asset, options: any = {}) {
      // todo: implement it!
    },

    read(queryPar) {
      return new Promise(resolve => {
        ddfCsvReader(`${this._basepath}/datapackage.json`)
          .query(queryPar).then(result => {

          resolve(result);
        });
      });
    }
  };
}
