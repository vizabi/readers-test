import * as chai from 'chai';
import { AbstractExpectationStrategy } from './abstract-expectation-strategy';
import { writeDiff } from "./utils";

const expect = chai.expect;

export class OnlySameQuantityExpectationStrategy extends AbstractExpectationStrategy {
  testIt(err, data, dataSourceSuffix: string, testIndex: number) {
    const fixtureData = require(this.fixturePath.replace(/#datasource#/, dataSourceSuffix));
    const fixtureDataStr = JSON.stringify(fixtureData, null, 2);
    const dataStr = JSON.stringify(data, null, 2);

    expect(!err).to.be.true;

    try {
      expect(data.length).to.equal(fixtureData.length);
    } catch (err) {
      writeDiff(testIndex, fixtureDataStr, dataStr);

      throw err;
    }
  }
}
