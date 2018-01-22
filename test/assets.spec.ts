import { isEqual } from 'lodash';
import * as chai from 'chai';
import { gmassets } from '../src/settings/datasources';
import { familyMembers } from '../src/settings/family-members';

const expect = chai.expect;

describe('Assets supporting', () => {

  familyMembers
    .filter(readerProvider => readerProvider.dataSource === gmassets)
    .forEach(readerProvider => {
      it(`${readerProvider.getTitle()}: should be expected result for JSON based asset`, () => {
        const EXPECTED_CONTENT = require('./data-fixtures/ddf--gapminder--static_assets/assets/world-50m.json');
        const pro = readerProvider.getObject().getAsset('/assets/world-50m.json');

        pro.then(data => {
          expect(isEqual(data, EXPECTED_CONTENT)).to.be.true;
        });
      });
    });

  familyMembers
    .filter(readerProvider => readerProvider.dataSource === gmassets)
    .forEach(readerProvider => {
      it(`${readerProvider.getTitle()}: should be expected result for TEXT based asset`, () => {
        const EXPECTED_CONTENT = 'test';
        const pro = readerProvider.getObject().getAsset('assets-text/test.txt');

        pro.then(data => {
          expect(data).to.equal(EXPECTED_CONTENT);
        });
      });

      it(`${readerProvider.getTitle()}: should be an error raised when asset path does NOT exist`, () => {
        const pro = readerProvider.getObject().getAsset('/assets-path-does-not-exist/test.txt');

        pro.catch(error => {
          expect(!!error).to.be.true
        });
      });
    });
});
