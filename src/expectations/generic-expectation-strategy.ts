import * as chai from 'chai';
import { isEmpty, keys } from 'lodash';
import * as base64 from 'base-64';
import { AbstractExpectationStrategy } from './abstract-expectation-strategy';
import { writeDiff } from './utils';

const expect = chai.expect;

export class GenericExpectationStrategy extends AbstractExpectationStrategy {
  testIt(err, data, dataSourceSuffix: string, testIndex: number) {
    const fixtureData = require(this.fixturePath.replace(/#datasource#/, dataSourceSuffix));
    const areEqual = this.equals(data, fixtureData);
    const fixtureDataStr = JSON.stringify(fixtureData, null, 2);
    const dataStr = JSON.stringify(data, null, 2);

    expect(!err).to.be.true;
    expect(data.length).to.equal(fixtureData.length);
    try {
      expect(areEqual).to.be.true;
    } catch (err) {
      writeDiff(testIndex, fixtureDataStr, dataStr);

      throw err;
    }
  }

  private equals(a, b) {
    if (a.length !== b.length) {

      return false;
    }

    const seen = {};

    for (const o of a) {
      const key = new Buffer(JSON.stringify(o, Object.keys(o).sort())).toString('base64');

      if (!seen[key]) {
        seen[key] = 0;
      }

      seen[key]++;
    }

    for (const o of b) {
      const key = new Buffer(JSON.stringify(o, Object.keys(o).sort())).toString('base64');

      if (!seen[key] && seen[key] !== 0) {
        return false;
      }

      seen[key]--;
    }

    return isEmpty(keys(seen).filter(key => seen[key] > 0))
  }
}
