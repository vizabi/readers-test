import { executionSummaryTable, runTests } from '../src/test-utils';
import { TestCase } from '../src/test-case';
import { sg } from '../src/settings/datasources';
import { GenericExpectationStrategy } from '../src/expectations/generic-expectation-strategy';

describe('Concepts supporting', () => {
  const aggregatedData = {};

  after(() => {
    executionSummaryTable(aggregatedData);
  });

  runTests([
    new TestCase()
      .forDataSource(sg)
      .withTitle('4 fields selects should be expected')
      .withFixturePath('../../test/result-fixtures/concepts/concepts-1-#datasource#.json')
      .withRequest({
        select: {
          key: ['concept'],
          value: [
            'concept_type', 'name', 'color'
          ]
        },
        from: 'concepts',
        where: {
          $and: [
            {concept_type: {$eq: 'entity_set'}}
          ]
        }
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('3 fields selects should be expected')
      .withFixturePath('../../test/result-fixtures/concepts/concepts-2-#datasource#.json')
      .withRequest({
        select: {
          key: ['concept'],
          value: [
            'concept_type', 'name'
          ]
        },
        from: 'concepts',
        where: {
          $and: [
            {concept_type: {$eq: 'entity_set'}}
          ]
        }
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('ar-SA base data selects should be expected')
      .withFixturePath('../../test/result-fixtures/concepts/concepts-3-#datasource#.json')
      .withRequest({
        language: 'ar-SA',
        select: {
          key: ['concept'],
          value: [
            'concept_type', 'name', 'color', 'description'
          ]
        },
        from: 'concepts',
        where: {
          $and: [
            {concept_type: {$eq: 'entity_set'}}
          ]
        }
      })
      .withExpectationStrategy(GenericExpectationStrategy)
  ], aggregatedData);
});
