import { executionSummaryTable, runTests } from '../src/test-utils';
import { GenericTestFlow } from '../src/test-flow';
import { TestCase } from '../src/test-case';
import { sg } from '../src/settings/datasets';

describe('Concepts supporting', () => {
  const aggregatedData = {};

  after(() => {
    executionSummaryTable(aggregatedData);
  });

  runTests([
    new TestCase()
      .forDataset(sg)
      .withTitle('4 fields selects should be expected')
      .withFixturePath('../test/result-fixtures/concepts/concepts-1-#dataset#.json')
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
      .withFlowConstructor(GenericTestFlow),
    new TestCase()
      .forDataset(sg)
      .withTitle('3 fields selects should be expected')
      .withFixturePath('../test/result-fixtures/concepts/concepts-2-#dataset#.json')
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
      .withFlowConstructor(GenericTestFlow),
    new TestCase()
      .forDataset(sg)
      .withTitle('ar-SA base data selects should be expected')
      .withFixturePath('../test/result-fixtures/concepts/concepts-3-#dataset#.json')
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
      .withFlowConstructor(GenericTestFlow)
  ], aggregatedData);
});
