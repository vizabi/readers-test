import * as chai from 'chai';
import { isEqual } from 'lodash';

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

export class ExactTestFlow extends AbstractTestFlow {
  testIt(err, data, datasetSuffix) {
    const fixtureData = require(this.fixturePath.replace(/#dataset#/, datasetSuffix));

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

export class OnlySameQuantityTestFlow extends AbstractTestFlow {
  testIt(err, data, datasetSuffix) {
    const fixtureData = require(this.fixturePath.replace(/#dataset#/, datasetSuffix));

    expect(!err).to.be.true;
    expect(data.length).to.equal(fixtureData.length);
  }
}
