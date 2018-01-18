import { runTests } from '../src/test-utils';
import { GenericTestFlow, QuickExactTestFlow } from '../src/test-flow';
import { TestCase } from '../src/test-case';
import { DataSource } from '../src/settings/datasources';

describe('Schema supporting', () => {
  describe('for concepts', () => {
    runTests([
      new TestCase()
        .forDataset(DataSource.sg)
        .withTitle('result for #readerProvider#')
        .withFixturePath('../test/result-fixtures/schema/schema-1-#dataSource#.json')
        .withRequest({
          select: {
            key: ["key", "value"],
            value: []
          },
          from: "concepts.schema"
        })
        .withExpectationStrategy(GenericTestFlow),
    ]);
  });
  describe('for entities', () => {
    runTests([
      new TestCase()
        .forDataset(DataSource.sg)
        .withTitle('result for #readerProvider#')
        .withFixturePath('../test/result-fixtures/schema/schema-2-#dataSource#.json')
        .withRequest({
          select: {
            key: ["key", "value"],
            value: []
          },
          from: "entities.schema"
        })
        .withExpectationStrategy(GenericTestFlow),
    ]);
  });
  describe('for datapoints', () => {
    runTests([
      new TestCase()
        .forDataset(DataSource.sg)
        .withTitle('result for #readerProvider# should response be expected for simple request')
        .withFixturePath('../test/result-fixtures/schema/schema-3-#dataSource#.json')
        .withRequest({
          select: {
            key: ["key", "value"],
            value: []
          },
          from: "datapoints.schema"
        })
        .withExpectationStrategy(QuickExactTestFlow),
      new TestCase()
        .forDataset(DataSource.sg)
        .withTitle('result for #readerProvider# should response be expected for SG')
        .withFixturePath('../test/result-fixtures/schema/schema-4-#dataSource#.json')
        .withRequest({
          select: {
            key: ["key", "value"],
            value: ["min(value)", "max(value)"]
          },
          from: "datapoints.schema"
        })
        .withExpectationStrategy(QuickExactTestFlow),
      new TestCase()
        .forDataset(DataSource.sankey)
        .withTitle('result for #readerProvider#')
        .withFixturePath('../test/result-fixtures/schema/schema-5-#dataSource#.json')
        .withRequest({
          select: {
            key: ["key", "value"],
            value: ["min(value)", "max(value)"]
          },
          from: "datapoints.schema"
        })
        .withExpectationStrategy(GenericTestFlow)
    ]);
  });
  describe('for general query', () => {
    new TestCase()
      .forDataset(DataSource.sg)
      .withTitle('result for #readerProvider#')
      .withFixturePath('../test/result-fixtures/schema/schema-6-#dataSource#.json')
      .withRequest({
        select: {
          key: ["key", "value"],
          value: []
        },
        from: "*.schema"
      })
      .withExpectationStrategy(GenericTestFlow)
  });
});
