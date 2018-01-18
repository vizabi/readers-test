import * as chai from 'chai';
import { AbstractExpectationStrategy } from './abstract-expectation-strategy';

const expect = chai.expect;

export class OnlySameQuantityExpectationStrategy extends AbstractExpectationStrategy {
  testIt(err, data, dataSourceSuffix) {
    const fixtureData = require(this.fixturePath.replace(/#datasource#/, dataSourceSuffix));

    expect(!err).to.be.true;
    expect(data.length).to.equal(fixtureData.length);
  }
}
