import { includes } from 'lodash';
import { TestCase } from './test-case';
import { Dataset } from './settings/datasets';
import { readersCases } from './settings/readers-cases';

export function runTests(testCases: TestCase[]) {
  for (const testCase of testCases) {
    testCase.checkConstraints();

    for (const readerCase of readersCases) {
      if (includes(testCase.datasets, readerCase.dataset)) {
        readerCase.checkConstraints();

        const title = `${readerCase.title}: ${testCase.title}`;
        const flow = new testCase.flowConstructor(testCase.fixturePath);

        it(title, done => {
          readerCase.read(testCase.request, (err, data) => {
            // console.log(JSON.stringify(data, null, 2));

            try {
              flow.testIt(err, data, Dataset[readerCase.dataset]);
              done();
            } catch (err) {
              done(err);
            }
          });
        });
      }
    }
  }
}
