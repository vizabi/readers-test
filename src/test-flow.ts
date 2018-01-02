import * as chai from 'chai';
import * as _ from 'lodash';

const diff = require('deep-object-diff').diff;

const expect = chai.expect;

export abstract class AbstractTestFlow {

  constructor(protected fixturePath) {
  }

  abstract testIt(err, data, datasetSuffix);
}

export class GenericTestFlow extends AbstractTestFlow {
  testIt(err, data, datasetSuffix) {
    const fixtureData = require(this.fixturePath.replace(/#dataset#/, datasetSuffix));
    const differences = this.getDataDifferences(data, fixtureData);
    const differencesStr = JSON.stringify(differences, null, 2);

    expect(!err).to.be.true;
    expect(data.length).to.equal(fixtureData.length);
    expect(differences, `diff is ${differencesStr}`).to.be.empty;
  }

  private getDataDifferences(data, fixtureData) {
    const differences = [];

    for (let dataIndex = 0; dataIndex < data.length; dataIndex++) {
      let existsIndex = 0;

      for (let fixtureIndex = 0; fixtureIndex < fixtureData.length; fixtureIndex++) {
        if (_.isEmpty(diff(data[dataIndex], fixtureData[fixtureIndex]))) {
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

export class ExactTestFlow extends AbstractTestFlow {
  testIt(err, data, datasetSuffix) {
    const fixtureData = require(this.fixturePath.replace(/#dataset#/, datasetSuffix));

    expect(!err).to.be.true;
    expect(data).to.deep.equal(fixtureData);
  }
}

export class QuickExactTestFlow extends AbstractTestFlow {
  testIt(err, data, datasetSuffix) {
    const fixtureData = require(this.fixturePath.replace(/#dataset#/, datasetSuffix));
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
