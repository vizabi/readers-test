import * as path from 'path';
import * as rimraf from 'rimraf';
import { table } from 'table';
import { head, keys, isEmpty, split, nth, noop } from 'lodash';
import { TestCase } from './test-case';
import { familyMembers } from './settings/family-members';
import { AbstractExpectationStrategy } from './expectations/abstract-expectation-strategy';
import { AbstractFamilyMember } from './family-definition/abstract-family-member';

let testIndex = 1;

const dir = path.resolve(__dirname, '..', 'test', 'result');

rimraf.sync(dir);

export function executionSummaryTable(aggregatedData) {
  const testTitles = keys(aggregatedData);
  const readerTitles = keys(aggregatedData[head(testTitles)]);

  const tableData = [
    ['Test case', ...(readerTitles.map(title => `${title}, ms`))]
  ];

  for (const testTitle of testTitles) {
    const rowData = [testTitle];

    for (const readerTitle of readerTitles) {
      if (aggregatedData[testTitle][readerTitle]) {
        rowData.push(aggregatedData[testTitle][readerTitle].executionTime);
      } else {
        rowData.push('');
      }
    }

    tableData.push(rowData);
  }

  const output = table(tableData);

  console.log(output);
}

function isTestCaseShouldBeOmitted(testCase: TestCase<AbstractExpectationStrategy>, readerCase: AbstractFamilyMember) {
  if (!isEmpty(testCase.unsupported)) {
    for (const unsupportedFamilyMember of testCase.unsupported) {
      const getClassName = classDefinition => nth(split(classDefinition.valueOf(), ' '), 1);

      if (getClassName(unsupportedFamilyMember) === readerCase.constructor.name) {
        return true;
      }
    }
  }

  return false;
}

export function runTests(testCases: TestCase<AbstractExpectationStrategy>[], aggregatedData = {}) {
  for (const testCase of testCases) {
    testCase.checkConstraints();

    for (const dataset of testCase.dataSources) {
      const testCaseTitleWithDataset = `${testCase.title} on "${dataset.name}"`;

      aggregatedData[testCaseTitleWithDataset] = {};

      for (const readerCase of familyMembers) {
        if (dataset === readerCase.dataSource) {
          readerCase.checkConstraints();

          aggregatedData[testCaseTitleWithDataset][readerCase.getTitle()] = {
            executionTime: null
          };

          const title = `"${readerCase.getTitle()}" on "${readerCase.dataSource.title} (${readerCase.dataSource.name})": ${testCase.title}`;
          const flow = new testCase.expectationStrategy(testCase.fixturePath);

          if (isTestCaseShouldBeOmitted(testCase, readerCase)) {
            if (aggregatedData[testCaseTitleWithDataset][readerCase.getTitle()]) {
              aggregatedData[testCaseTitleWithDataset][readerCase.getTitle()].executionTime = '***';
            }

            xit(`***UNSUPPORTED *** ${title}`, noop);
          } else {
            it(`${title} [#${testIndex}]`, done => {
              const timeStart = new Date().getTime();

              readerCase.read(testCase.request, (err, data) => {
                // console.log(JSON.stringify(data, null, 2));

                const timeFinish = new Date().getTime();

                if (aggregatedData[testCaseTitleWithDataset][readerCase.getTitle()]) {
                  aggregatedData[testCaseTitleWithDataset][readerCase.getTitle()].executionTime = timeFinish - timeStart;
                }

                try {
                  flow.testIt(err, data, readerCase.dataSource.name, testIndex);

                  done();
                } catch (err) {
                  done(err);
                }
              });
            });

            testIndex++;
          }
        }
      }
    }
  }
}
