import { runTests } from '../src/test-utils';
import { GenericTestFlow, QuickExactTestFlow } from '../src/test-flow';
import { TestCase } from '../src/test-case';
import { Dataset } from '../src/settings/datasets';

describe('Schema supporting', () => {
  describe('for concepts', () => {
    runTests([
      new TestCase()
        .forDataset(Dataset.sg)
        .withTitle('result for #readerProvider#')
        .withFixturePath('../test/result-fixtures/schema/schema-1-#dataset#.json')
        .withRequest({
          select: {
            key: ["key", "value"],
            value: []
          },
          from: "concepts.schema"
        })
        .withFlowConstructor(GenericTestFlow),
    ]);
  });
  describe('for entities', () => {
    runTests([
      new TestCase()
        .forDataset(Dataset.sg)
        .withTitle('result for #readerProvider#')
        .withFixturePath('../test/result-fixtures/schema/schema-2-#dataset#.json')
        .withRequest({
          select: {
            key: ["key", "value"],
            value: []
          },
          from: "entities.schema"
        })
        .withFlowConstructor(GenericTestFlow),
    ]);
  });
  describe('for datapoints', () => {
    runTests([
      new TestCase()
        .forDataset(Dataset.sg)
        .withTitle('result for #readerProvider# should response be expected for simple request')
        .withFixturePath('../test/result-fixtures/schema/schema-3-#dataset#.json')
        .withRequest({
          select: {
            key: ["key", "value"],
            value: []
          },
          from: "datapoints.schema"
        })
        .withFlowConstructor(QuickExactTestFlow),
      new TestCase()
        .forDataset(Dataset.sg)
        .withTitle('result for #readerProvider# should response be expected for SG')
        .withFixturePath('../test/result-fixtures/schema/schema-4-#dataset#.json')
        .withRequest({
          select: {
            key: ["key", "value"],
            value: ["min(value)", "max(value)"]
          },
          from: "datapoints.schema"
        })
        .withFlowConstructor(QuickExactTestFlow),
      new TestCase()
        .forDataset(Dataset.sankey)
        .withTitle('result for #readerProvider#')
        .withFixturePath('../test/result-fixtures/schema/schema-5-#dataset#.json')
        .withRequest({
          select: {
            key: ["key", "value"],
            value: ["min(value)", "max(value)"]
          },
          from: "datapoints.schema"
        })
        .withFlowConstructor(GenericTestFlow)
    ]);
  });
  describe('for general query', () => {
    new TestCase()
      .forDataset(Dataset.sg)
      .withTitle('result for #readerProvider#')
      .withFixturePath('../test/result-fixtures/schema/schema-6-#dataset#.json')
      .withRequest({
        select: {
          key: ["key", "value"],
          value: []
        },
        from: "*.schema"
      })
      .withFlowConstructor(GenericTestFlow)
  });
});
