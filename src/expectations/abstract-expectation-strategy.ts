export abstract class AbstractExpectationStrategy {

  constructor(protected fixturePath) {
  }

  abstract testIt(err, data, dataSourceSuffix: string, testIndex: number);
}
