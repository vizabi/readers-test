import { table } from 'table';
import { head, keys } from 'lodash';
import { TestCase } from './test-case';
import { readersCases } from './settings/readers-cases';

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

export function runTests(testCases: TestCase[], aggregatedData = {}) {
  for (const testCase of testCases) {
    testCase.checkConstraints();

    for (const dataset of testCase.datasets) {
      const testCaseTitleWithDataset = `${testCase.title} on "${dataset.name}"`;

      aggregatedData[testCaseTitleWithDataset] = {};

      for (const readerCase of readersCases) {
        if (dataset === readerCase.dataset) {
          readerCase.checkConstraints();

          aggregatedData[testCaseTitleWithDataset][readerCase.getTitle()] = {
            executionTime: null
          };

          const title = `"${readerCase.getTitle()}" on "${readerCase.dataset.title}": ${testCase.title}`;
          const flow = new testCase.flowConstructor(testCase.fixturePath);

          it(title, done => {
            const timeStart = new Date().getTime();

            readerCase.read(testCase.request, (err, data) => {
              // console.log(JSON.stringify(data, null, 2));

              const timeFinish = new Date().getTime();

              if (aggregatedData[testCaseTitleWithDataset][readerCase.getTitle()]) {
                aggregatedData[testCaseTitleWithDataset][readerCase.getTitle()].executionTime = timeFinish - timeStart;
              }

              try {
                flow.testIt(err, data, readerCase.dataset.name);
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
