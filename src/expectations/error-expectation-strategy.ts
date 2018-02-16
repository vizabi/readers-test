import * as chai from "chai";
import { AbstractExpectationStrategy } from "./abstract-expectation-strategy";

const expect = chai.expect;

export class ErrorExpectationStrategy extends AbstractExpectationStrategy {
  testIt(err, data, dataSourceSuffix: string, testIndex: number) {

    expect(!!err).to.be.true;
  }
}
