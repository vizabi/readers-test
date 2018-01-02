import { isEqual } from 'lodash';
import * as chai from 'chai';
import { Dataset } from '../src/datasets';
import { readersCases } from '../src/test-utils';

const expect = chai.expect;

describe('Assets supporting', () => {
  readersCases
    .filter(readerProvider => readerProvider.dataset === Dataset.gmassets)
    .forEach(readerProvider => {
      it('should be expected result for JSON based asset', () => {
        const EXPECTED_CONTENT = require('./data-fixtures/ddf--gapminder--static_assets/assets/world-50m.json');
        const pro = readerProvider.getReaderObject().getAsset('/assets/world-50m.json');

        pro.then(data => {
          expect(isEqual(data, EXPECTED_CONTENT)).to.be.true;
        });
      });
    });

  readersCases
    .filter(readerProvider => readerProvider.dataset === Dataset.gmassets)
    .forEach(readerProvider => {
      it('should be expected result for TEXT based asset', () => {
        const EXPECTED_CONTENT = 'test';
        const pro = readerProvider.getReaderObject().getAsset('assets-text/test.txt');

        pro.then(data => {
          expect(data).to.equal(EXPECTED_CONTENT);
        });
      });

      it('should be an error raised when asset path does NOT exist', () => {
        const pro = readerProvider.getReaderObject().getAsset('/assets-path-does-not-exist/test.txt');

        pro.catch(error => {
          expect(!!error).to.be.true
        });
      });
    });
});
