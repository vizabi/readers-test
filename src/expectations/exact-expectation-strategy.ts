import * as chai from 'chai';
import { isEqual } from 'lodash';
import { AbstractExpectationStrategy } from './abstract-expectation-strategy';

const expect = chai.expect;

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
