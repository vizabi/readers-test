import * as chai from 'chai';
import { AbstractExpectationStrategy } from './abstract-expectation-strategy';

const expect = chai.expect;

function isEqual(a, b) {
  const keysA = Object.keys(a).sort();
  const keysB = Object.keys(b).sort();

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (let i = 0; i < keysA.length; i++) {
    if (keysA[i] !== keysB[i]) {
      return false;
    }
  }

  for (const key of keysA) {
    if (a[key] != b[key]) {
      return false;
    }
  }

  return true;
}

export class ExactExpectationStrategy extends AbstractExpectationStrategy {
  testIt(err, data, dataSourceSuffix) {
    const fixtureData = require(this.fixturePath.replace(/#datasource#/, dataSourceSuffix));

    expect(!err).to.be.true;
    expect(data.length).to.equal(fixtureData.length);

    let diffRecord, diffPosition;

    for (let i = 0; i < data.length; i++) {
      if (!isEqual(data[i], fixtureData[i])) {
        diffRecord = data[i];
        diffPosition = i;
        break;
      }
    }

    expect(!!diffRecord, `diff:\n${JSON.stringify(diffRecord, null, 2)} on line ${diffPosition}`).to.be.false;
  }
}
