import * as chai from 'chai';
import {isEmpty, keys, cloneDeep} from 'lodash';
import * as base64 from 'base-64';
import {AbstractExpectationStrategy} from './abstract-expectation-strategy';
import {writeDiff} from './utils';

const expect = chai.expect;

function stringifyObjectValues(o, isNullAsEmptyString: boolean = false) {
  const newObject = cloneDeep(o);

  for (const key of Object.keys(newObject)) {
    let value = newObject[key];

    if (value === null && isNullAsEmptyString) {
      value = '';
    }

    newObject[key] = `${value}`;
  }

  return newObject;
}

export class GenericExpectationStrategy extends AbstractExpectationStrategy {
  testIt(err, data, dataSourceSuffix: string, testIndex: number) {
    const fixtureData = require(this.fixturePath.replace(/#datasource#/, dataSourceSuffix));
    const fixtureDataStr = JSON.stringify(fixtureData, null, 2);
    const dataStr = JSON.stringify(data, null, 2);

    // console.log(dataStr);

    try {
      expect(!err).to.be.true;
      expect(data.length).to.equal(fixtureData.length);

      const areEqual = this.equals(data, fixtureData);

      expect(areEqual).to.be.true;
    } catch (err) {
      writeDiff(JSON.stringify(err, null, 2), testIndex, fixtureDataStr, dataStr);

      throw err;
    }
  }

  private equals(a, b) {
    if (a.length !== b.length) {
      return false;
    }

    const seen = {};
    const aa = a.map(aaa => stringifyObjectValues(aaa, true));
    const bb = b.map(bbb => stringifyObjectValues(bbb, true));

    for (const o of aa) {
      const key = new Buffer(JSON.stringify(o, Object.keys(o).sort())).toString('base64');

      if (!seen[key]) {
        seen[key] = 0;
      }

      seen[key]++;
    }

    for (const o of bb) {
      const key = new Buffer(JSON.stringify(o, Object.keys(o).sort())).toString('base64');

      if (!seen[key] && seen[key] !== 0) {
        return false;
      }

      seen[key]--;
    }

    return isEmpty(keys(seen).filter(key => seen[key] > 0))
  }
}
