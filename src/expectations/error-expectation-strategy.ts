import * as chai from "chai";
import { AbstractExpectationStrategy } from "./abstract-expectation-strategy";

const expect = chai.expect;

export class ErrorExpectationStrategy extends AbstractExpectationStrategy {
  testIt(err, data, dataSourceSuffix) {

    expect(!!err).to.be.true;
  }
}
