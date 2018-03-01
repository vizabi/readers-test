import { executionSummaryTable, runTests } from '../src/test-utils';
import { TestCase } from '../src/test-case';
import { sg } from '../src/settings/datasources';
import { ErrorExpectationStrategy } from '../src/expectations/error-expectation-strategy';
import { DdfCsvReader } from "../src/family-definition/ddf-csv-reader";
import { WsReader } from "../src/family-definition/ws-reader";

describe('Concepts supporting', () => {
  const aggregatedData = {};
  const testCases = [
    new TestCase()
      .forDataSource(sg)
      .unsupportedFor('this issue is not critical, can be resolved later', WsReader)
      .withTitle('an exception should be raised for request with an error')
      .withFixturePath('fake...')
      .withRequest({
        select: {
          key: ['wrong_concept'],
          value: [
            'concept_type', 'name', 'description'
          ]
        },
        from: 'concepts',
        where: {
          $and: [
            {concept_type: {$eq: 'entity_set'}}
          ]
        },
        order_by: ['concept']
      })
      .withExpectationStrategy(ErrorExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .unsupportedFor('', WsReader)
      .withTitle('an exception should be raised for empty request')
      .withFixturePath('fake...')
      .withRequest({})
      .withExpectationStrategy(ErrorExpectationStrategy)
  ];

  after(() => {
    executionSummaryTable(testCases, aggregatedData);
  });

  runTests(testCases, aggregatedData);
});
