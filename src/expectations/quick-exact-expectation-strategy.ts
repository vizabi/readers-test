import * as chai from "chai";
import { AbstractExpectationStrategy } from "./abstract-expectation-strategy";

const expect = chai.expect;

export class QuickExactExpectationStrategy extends AbstractExpectationStrategy {
  testIt(err, data, dataSourceSuffix: string, testIndex: number) {
    const fixtureData = require(this.fixturePath.replace(/#datasource#/, dataSourceSuffix));
    const fixtureDataStr = JSON.stringify(fixtureData);
    const dataStr = JSON.stringify(data);

    expect(!err).to.be.true;
    expect(dataStr.length).to.equal(fixtureDataStr.length);

    let areEqual = true;

    for (let i = 0; i < dataStr.length; i++) {
      if (fixtureDataStr[i] !== dataStr[i]) {
        areEqual = false;
        break;
      }
    }

    expect(areEqual).to.be.true;
  }
}
