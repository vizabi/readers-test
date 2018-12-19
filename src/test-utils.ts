import * as path from 'path';
import * as rimraf from 'rimraf';
import * as colors from 'colors';
import { table } from 'table';
import { head, keys, isEmpty, split, nth, noop, cloneDeep } from 'lodash';
import { TestCase } from './test-case';
import { familyMembers } from './settings/family-members';
import { AbstractExpectationStrategy } from './expectations/abstract-expectation-strategy';
import { AbstractFamilyMember } from './family-definition/abstract-family-member';

function* testIndexMaker() {
  let index = 1;

  while (true) {
    yield index++;
  }
}

const testIndex = testIndexMaker();

const dir = path.resolve(__dirname, '..', 'test', 'result');

rimraf.sync(dir);

function explainWhyDoNotSupport(testCases: TestCase<AbstractExpectationStrategy>[]) {
  const reasons = testCases
    .filter(testCase => !isEmpty(testCase.unsupported) && !isEmpty(testCase.whyDoNotSupport))
    .map(testCase => [testCase.title, testCase.whyDoNotSupport]);

  if (isEmpty(reasons)) {
    return '';
  }

  return colors.red('Postpone status:') + '\n' +
    colors.white(table([['Test case', 'Reason to prevent supporting'], ...reasons]));
}

export function executionSummaryTable(testCases: TestCase<AbstractExpectationStrategy>[], aggregatedData) {
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

  const output = `${colors.yellow(table(tableData))}${explainWhyDoNotSupport(testCases)}`;

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

export function runTests(testCases: TestCase<AbstractExpectationStrategy>[], aggregatedData = {}, diagnosticData = []) {
  for (const testCase of testCases) {
    testCase.checkConstraints();

    for (const dataset of testCase.dataSources) {
      const testCaseTitleWithDataset = `${testCase.title} on "${dataset.name}"`;

      aggregatedData[testCaseTitleWithDataset] = {};

      for (const familyMember of familyMembers) {
        if (dataset === familyMember.dataSource) {
          familyMember.checkConstraints();

          aggregatedData[testCaseTitleWithDataset][familyMember.getTitle()] = {
            executionTime: null
          };

          const title = `"${familyMember.getTitle()}" on "${familyMember.dataSource.title} (${familyMember.dataSource.name})": ${testCase.title}`;
          const flow = new testCase.expectationStrategy(testCase.fixturePath);

          if (isTestCaseShouldBeOmitted(testCase, familyMember)) {
            if (aggregatedData[testCaseTitleWithDataset][familyMember.getTitle()]) {
              aggregatedData[testCaseTitleWithDataset][familyMember.getTitle()].executionTime = '***';
            }

            xit(`***UNSUPPORTED *** ${title}`, noop);
          } else {
            const currentTestIndex = testIndex.next().value;

            it(`${title} [#${currentTestIndex}]`, done => {
              const timeStart = new Date().getTime();
              const request = cloneDeep(testCase.request);

              request.dataset = `${familyMember.initData.dataset}#master`;

              familyMember.read(request, (err, response) => {
                // console.log(JSON.stringify(data, null, 2));

                const timeFinish = new Date().getTime();

                if (aggregatedData[testCaseTitleWithDataset][familyMember.getTitle()]) {
                  aggregatedData[testCaseTitleWithDataset][familyMember.getTitle()].executionTime = timeFinish - timeStart;
                }

                if (response && response.diagnostic) {
                  diagnosticData.push({
                    title: `${title} [#${currentTestIndex}]`,
                    diagnostic: response.diagnostic,
                    executionTime: aggregatedData[testCaseTitleWithDataset][familyMember.getTitle()].executionTime
                  });
                }

                try {
                  const content = response && response.content ? response.content : response;

                  flow.testIt(err, content, familyMember.dataSource.name, currentTestIndex);

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
  }
}
