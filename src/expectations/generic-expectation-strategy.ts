import * as chai from 'chai';
import { isEqual } from 'lodash';
import { AbstractExpectationStrategy } from './abstract-expectation-strategy';

const expect = chai.expect;

export class GenericExpectationStrategy extends AbstractExpectationStrategy {
  testIt(err, data, dataSourceSuffix) {
    const fixtureData = require(this.fixturePath.replace(/#datasource#/, dataSourceSuffix));
    const differences = this.getDataDifferences(data, fixtureData);
    const fixtureDataStr = JSON.stringify(fixtureData, null, 2);
    const dataStr = JSON.stringify(data, null, 2);
    const differencesStr = JSON.stringify(differences, null, 2);

    expect(!err).to.be.true;
    expect(data.length).to.equal(fixtureData.length);
    expect(differences, `\noriginal:\n${fixtureDataStr}\ncurrent:${dataStr}\ndiff:${differencesStr}\n`).to.be.empty;
  }

  private getDataDifferences(data, fixtureData) {
    const differences = [];

    for (let dataIndex = 0; dataIndex < data.length; dataIndex++) {
      let existsIndex = 0;

      for (let fixtureIndex = 0; fixtureIndex < fixtureData.length; fixtureIndex++) {
        if (!isEqual(data[dataIndex], fixtureData[fixtureIndex])) {
          existsIndex++;
        }
      }

      if (existsIndex === 0) {
        differences.push(data[dataIndex]);
      }
    }

    return differences;
  }
}
