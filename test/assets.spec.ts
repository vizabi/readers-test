import * as chai from 'chai';
import { gmassets } from '../src/settings/datasources';
import { familyMembers } from '../src/settings/family-members';
import { DdfCsvReader } from "../src/family-definition/ddf-csv-reader";

const expect = chai.expect;

describe('Assets supporting', () => {

  familyMembers
    .filter(familyMember => familyMember.dataSource === gmassets && familyMember instanceof DdfCsvReader)
    .forEach(familyMember => {
      it(`${familyMember.getTitle()}: should be expected result for JSON based asset`, () => {
        const EXPECTED_CONTENT = require('./data-fixtures/ddf--gapminder--static_assets/assets/world-50m.json');
        familyMember.getAsset('/assets/world-50m.json', (err, data) => {
          expect(!!err).to.be.false;
          expect(data).to.be.deep.equal(EXPECTED_CONTENT);
        });
      });
    });

  familyMembers
    .filter(familyMember => familyMember.dataSource === gmassets && familyMember instanceof DdfCsvReader)
    .forEach(readerProvider => {
      it(`${readerProvider.getTitle()}: should be expected result for TEXT based asset`, () => {
        const EXPECTED_CONTENT = 'test';

        readerProvider.getAsset('assets-text/test.txt', (err, data) => {
          expect(!!err).to.be.false;
          expect(data).to.be.deep.equal(EXPECTED_CONTENT);
        });
      });

      it(`${readerProvider.getTitle()}: should be an error raised when asset path does NOT exist`, () => {
        readerProvider.getAsset('/assets-path-does-not-exist/test.txt', (err, data) => {
          expect(!!err).to.be.true;
        });
      });
    });
});
